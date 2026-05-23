import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { saveFaqAction } from "@/server/cms/actions";
import { AdminCard, AdminShell, inputClass } from "@/components/admin/admin-shell";

export default async function AdminContentPage() {
  await requireAdmin();
  const [faqs, testimonials, stations] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.chargingStation.findMany({ orderBy: [{ district: "asc" }, { sortOrder: "asc" }] }),
  ]);
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <AdminCard title="FAQ">
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <form key={faq.id} action={saveFaqAction} className="rounded-lg border border-paper-line p-3">
                  <input type="hidden" name="id" value={faq.id} />
                  <input name="question" defaultValue={faq.question} className={inputClass} />
                  <textarea name="answer" defaultValue={faq.answer} rows={3} className={inputClass} />
                  <input name="sortOrder" type="number" defaultValue={faq.sortOrder} className={inputClass} />
                  <label className="mt-2 flex items-center gap-2 text-sm"><input name="isActive" type="checkbox" defaultChecked={faq.isActive} /> Active</label>
                  <button className="mt-3 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white">Lưu</button>
                </form>
              ))}
            </div>
          </AdminCard>
          <AdminCard title="Testimonials">
            <ul className="space-y-3 text-sm">
              {testimonials.map((item) => <li key={item.id} className="rounded-lg border border-paper-line p-3"><strong>{item.name}</strong><p>{item.content}</p></li>)}
            </ul>
          </AdminCard>
          <AdminCard title="Trạm sạc">
            <ul className="columns-1 gap-4 text-sm md:columns-2">
              {stations.map((station) => <li key={station.id} className="mb-2 break-inside-avoid"><strong>{station.name}</strong><br /><span className="text-ink-muted">{station.district} - {station.address}</span></li>)}
            </ul>
          </AdminCard>
        </div>
        <AdminCard title="Thêm FAQ">
          <form action={saveFaqAction} className="grid gap-3">
            <label className="text-sm font-semibold">Câu hỏi<input name="question" required className={inputClass} /></label>
            <label className="text-sm font-semibold">Trả lời<textarea name="answer" required rows={5} className={inputClass} /></label>
            <label className="text-sm font-semibold">Thứ tự<input name="sortOrder" type="number" defaultValue={0} className={inputClass} /></label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input name="isActive" type="checkbox" defaultChecked /> Active</label>
            <button className="btn-primary px-5 py-3">Thêm FAQ</button>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
