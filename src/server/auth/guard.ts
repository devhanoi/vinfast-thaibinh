import "server-only";
import { auth } from "./auth";
import { UnauthorizedError, ForbiddenError } from "../errors";

export type AdminContext = { id: string; email: string; role: "admin" };

export async function getCurrentAdmin(): Promise<AdminContext | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role ?? "admin",
  };
}

export async function requireAdmin(): Promise<AdminContext> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new UnauthorizedError();
  if (admin.role !== "admin") throw new ForbiddenError();
  return admin;
}
