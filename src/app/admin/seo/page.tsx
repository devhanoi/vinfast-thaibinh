import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { saveSeoAction } from "@/server/cms/actions";
import { AdminCard, AdminShell, inputClass } from "@/components/admin/admin-shell";

export default async function AdminSeoPage() {
  await requireAdmin();
  const rows = await prisma.seoSetting.findMany({ orderBy: { pageKey: "asc" } });
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-2">
        {rows.map((row) => <SeoForm key={row.id} row={row} />)}
        <AdminCard title="Thêm SEO page"><SeoForm /></AdminCard>
      </div>
    </AdminShell>
  );
}

function SeoForm({ row }: { row?: { pageKey: string; title: string; description: string; ogImageUrl: string | null; canonicalPath: string } }) {
  return (
    <AdminCard title={row?.pageKey ?? "SEO"}>
      <form action={saveSeoAction} className="grid gap-3">
        <label className="text-sm font-semibold">Page key<input name="pageKey" defaultValue={row?.pageKey ?? "home"} required className={inputClass} /></label>
        <label className="text-sm font-semibold">Title<input name="title" defaultValue={row?.title} required className={inputClass} /></label>
        <label className="text-sm font-semibold">Description<textarea name="description" defaultValue={row?.description} required rows={4} className={inputClass} /></label>
        <label className="text-sm font-semibold">OG image<input name="ogImageUrl" defaultValue={row?.ogImageUrl ?? ""} className={inputClass} /></label>
        <label className="text-sm font-semibold">Canonical path<input name="canonicalPath" defaultValue={row?.canonicalPath ?? "/"} required className={inputClass} /></label>
        <button className="btn-primary px-5 py-3">Lưu SEO</button>
      </form>
    </AdminCard>
  );
}
