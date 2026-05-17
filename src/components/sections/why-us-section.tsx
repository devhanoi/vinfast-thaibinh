import { SITE } from "@/lib/site";
import { Users, MapPinned, Wrench, Award } from "lucide-react";

const STATS = [
  { icon: Users, value: "2.500+", label: "Khách hàng đã giao xe" },
  { icon: MapPinned, value: "15", label: "Trạm sạc V-Green tại Thái Bình" },
  { icon: Wrench, value: "60+", label: "Kỹ thuật viên có chứng chỉ" },
  { icon: Award, value: "Top 1", label: "Doanh số DragonGroup 2025" },
];

export function WhyUsSection() {
  return (
    <section id="vi-sao" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <p className="eyebrow">Vì sao chọn VinFast Thái Bình</p>
          <h2 className="mt-3 h-section text-ink">
            Đại lý ủy quyền 3S quy mô lớn nhất khu vực Đồng bằng Sông Hồng
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            VinFast Thái Bình – thành viên hệ sinh thái DragonGroup – đầu tư showroom 3.500 m² tại
            Đại Lộ Kỳ Đồng, trang bị đầy đủ khu trưng bày, lái thử nội bộ, xưởng dịch vụ và kho
            phụ tùng đạt chuẩn VinFast Toàn Cầu.
          </p>

          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-paper-line bg-paper-soft p-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink font-display text-xl font-bold text-brand">
              MK
            </div>
            <div>
              <p className="font-display font-bold text-ink">
                {SITE.salesRep.name} – {SITE.salesRep.role}
              </p>
              <p className="text-sm text-ink-muted">
                {SITE.salesRep.experience}, hơn 1.200 hợp đồng đã ký, Top sales DragonGroup 2025.
              </p>
              <a href={`tel:${SITE.hotlineE164}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
                Gọi trực tiếp {SITE.hotline}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <Icon className="text-brand" size={26} aria-hidden />
              <p className="mt-4 font-display text-3xl font-extrabold text-ink">{value}</p>
              <p className="mt-1 text-sm text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
