import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/server/db/prisma";

type Body = {
  name?: string;
  phone?: string;
  model?: string;
  address?: string;
  note?: string;
  website?: string;
};

const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const phone = (body.phone ?? "").replace(/[\s.\-()]/g, "");
  const model = body.model?.trim() ?? "";

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Họ tên không hợp lệ" }, { status: 400 });
  }
  if (!PHONE_REGEX.test(phone)) {
    return NextResponse.json({ ok: false, error: "Số điện thoại không hợp lệ" }, { status: 400 });
  }
  if (!model) {
    return NextResponse.json({ ok: false, error: "Vui lòng chọn dòng xe" }, { status: 400 });
  }

  const lead = { name, phone, model, address: body.address?.trim(), note: body.note?.trim(), source: "website" };
  if (hasDatabaseUrl()) {
    await prisma.lead.create({ data: lead });
  } else {
    console.info("[lead] received without DATABASE_URL", lead);
  }

  return NextResponse.json({ ok: true });
}
