import { redirect } from "next/navigation";
import { auth } from "@/server/auth/auth";
import { AdminShell } from "../_components/admin-shell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
