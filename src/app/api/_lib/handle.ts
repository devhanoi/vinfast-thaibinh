import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError } from "@/server/errors";

export async function handle<T>(handler: () => Promise<T>): Promise<Response> {
  try {
    const data = await handler();
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
