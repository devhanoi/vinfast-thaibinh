import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPage() {
  await requireAdmin();
  const [products, leads, heroSlides, faqs] = await Promise.all([
    prisma.product.count(),
    prisma.lead.count(),
    prisma.heroSlide.count(),
    prisma.faq.count(),
  ]);
  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard title="Sản phẩm"><p className="font-display text-3xl font-bold text-brand">{products}</p></AdminCard>
        <AdminCard title="Lead"><p className="font-display text-3xl font-bold text-brand">{leads}</p></AdminCard>
        <AdminCard title="Hero"><p className="font-display text-3xl font-bold text-brand">{heroSlides}</p></AdminCard>
        <AdminCard title="FAQ"><p className="font-display text-3xl font-bold text-brand">{faqs}</p></AdminCard>
      </div>
    </AdminShell>
  );
}
