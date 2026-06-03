import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ZodError } from "zod";
import { DomainError } from "@/server/errors";

type HandleOptions = {
  /** Cache tags để revalidate sau khi handler thành công (mutation routes). */
  revalidate?: string[];
};

export async function handle<T>(
  handler: () => Promise<T>,
  options: HandleOptions = {},
): Promise<Response> {
  try {
    const data = await handler();
    if (options.revalidate?.length) {
      for (const tag of options.revalidate) {
        // Next 16 yêu cầu profile arg (max | default | stale). 'max' = invalidate ngay.
        (revalidateTag as (t: string, profile?: string) => void)(tag, "max");
      }
    }
    if (data === undefined) return new Response(null, { status: 204 });
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "validation_failed",
            message: "Dữ liệu không hợp lệ",
            details: err.flatten(),
          },
        },
        { status: 400 },
      );
    }
    if (err instanceof DomainError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        { status: err.status },
      );
    }
    console.error("[api] unhandled error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Đã xảy ra lỗi nội bộ" } },
      { status: 500 },
    );
  }
}

/** Shortcut: invalidate CMS cache (home + cms tags) sau mutation public-facing. */
export const REVALIDATE_CMS = ["cms", "home"];
