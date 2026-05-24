import { auth } from "@/server/auth/auth";
import { AdminShell } from "./_components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) return <>{children}</>;
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
