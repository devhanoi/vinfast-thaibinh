import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { saveHeroSlideAction } from "@/server/cms/actions";
import { AdminCard, AdminShell, inputClass } from "@/components/admin/admin-shell";

export default async function AdminHeroPage() {
  await requireAdmin();
  const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-2">
        {slides.map((slide) => (
          <AdminCard key={slide.id} title={slide.title}>
            <HeroForm slide={slide} />
          </AdminCard>
        ))}
        <AdminCard title="Thêm hero slide"><HeroForm /></AdminCard>
      </div>
    </AdminShell>
  );
}

function HeroForm({ slide }: { slide?: { id: string; title: string; subtitle: string; imageUrl: string; imageAlt: string; ctaLabel: string; ctaHref: string; isActive: boolean; sortOrder: number } }) {
  return (
    <form action={saveHeroSlideAction} className="grid gap-3">
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <label className="text-sm font-semibold">Title<input name="title" defaultValue={slide?.title} required className={inputClass} /></label>
      <label className="text-sm font-semibold">Subtitle<textarea name="subtitle" defaultValue={slide?.subtitle} required rows={3} className={inputClass} /></label>
      <label className="text-sm font-semibold">Image URL<input name="imageUrl" defaultValue={slide?.imageUrl} required className={inputClass} /></label>
      <label className="text-sm font-semibold">Image alt<input name="imageAlt" defaultValue={slide?.imageAlt} required className={inputClass} /></label>
      <label className="text-sm font-semibold">CTA label<input name="ctaLabel" defaultValue={slide?.ctaLabel ?? "Nhận báo giá"} required className={inputClass} /></label>
      <label className="text-sm font-semibold">CTA href<input name="ctaHref" defaultValue={slide?.ctaHref ?? "#bao-gia"} required className={inputClass} /></label>
      <label className="text-sm font-semibold">Thứ tự<input name="sortOrder" type="number" defaultValue={slide?.sortOrder ?? 0} className={inputClass} /></label>
      <label className="flex items-center gap-2 text-sm font-semibold"><input name="isActive" type="checkbox" defaultChecked={slide?.isActive ?? true} /> Active</label>
      <button className="btn-primary px-5 py-3">Lưu hero</button>
    </form>
  );
}
