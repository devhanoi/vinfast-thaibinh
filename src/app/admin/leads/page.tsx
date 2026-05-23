import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { updateLeadStatusAction } from "@/server/cms/actions";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <AdminShell>
      <AdminCard title="Lead mới nhất">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b border-paper-line text-left"><th className="py-2">Khách</th><th>Xe</th><th>Ghi chú</th><th>Ngày</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-paper-line">
                  <td className="py-3"><strong>{lead.name}</strong><br /><a href={`tel:${lead.phone}`} className="text-brand">{lead.phone}</a></td>
                  <td>{lead.model}</td>
                  <td>{lead.address}<br />{lead.note}</td>
                  <td>{lead.createdAt.toLocaleString("vi-VN")}</td>
                  <td>
                    <form action={updateLeadStatusAction} className="flex gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <select name="status" defaultValue={lead.status} className="rounded-lg border border-paper-line px-2 py-1">
                        <option value="new">new</option><option value="contacted">contacted</option><option value="won">won</option><option value="lost">lost</option>
                      </select>
                      <button className="rounded-lg bg-ink px-3 py-1 text-xs font-semibold text-white">Lưu</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
