import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma, hasDatabaseUrl } from "@/server/db/prisma";

const SESSION_COOKIE = "vf_admin_session";
const SESSION_DAYS = 14;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function loginAdmin(email: string, password: string) {
  if (!hasDatabaseUrl()) {
    throw new Error("Chưa cấu hình DATABASE_URL cho admin login.");
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !user.isActive) return false;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return false;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { adminUserId: user.id, tokenHash: hashToken(token), expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && hasDatabaseUrl()) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !hasDatabaseUrl()) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;
  return session.user;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
