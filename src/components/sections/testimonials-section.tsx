import { Star } from "lucide-react";
import type { CmsTestimonial } from "@/server/cms/types";

const REVIEWS = [
  {
    name: "Anh Phạm Tuấn",
    place: "TP. Thái Bình",
    car: "VinFast VF 5 Plus",
    rating: 5,
    content:
      "Mr. Khánh tư vấn rất kỹ về tổng chi phí lăn bánh và hỗ trợ trả góp qua VPBank chỉ trong 2 ngày là nhận xe. Showroom rộng rãi, đội kỹ thuật nhiệt tình.",
  },
  {
    name: "Chị Trần Hồng",
    place: "Huyện Đông Hưng",
    car: "VinFast VF 6",
    rating: 5,
    content:
      "Đặt lái thử tận nhà ở Đông Hưng, đội bán hàng đến đúng hẹn. Sau khi mua VF 6 mình thấy chi phí đi lại giảm hẳn so với xe xăng cũ.",
  },
  {
    name: "Anh Nguyễn Hùng",
    place: "Huyện Vũ Thư",
    car: "VinFast VF 8 Eco",
    rating: 5,
    content:
      "Đại lý đầy đủ dịch vụ, mình bảo dưỡng định kỳ luôn tại đây. Phụ tùng có sẵn, kỹ thuật viên giải thích rõ ràng từng hạng mục.",
  },
];

export function TestimonialsSection({ testimonials }: { testimonials?: CmsTestimonial[] }) {
  const items = testimonials ?? REVIEWS.map((r, index) => ({ ...r, id: r.name, location: r.place, vehicle: r.car, isActive: true, sortOrder: index + 1 }));
  return (
    <section className="bg-paper-soft section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Khách hàng tại Thái Bình nói gì</p>
          <h2 className="mt-3 h-section text-ink">Những hành trình điện hóa đầu tiên trên đất Thái Bình</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((r) => (
            <figure key={r.id} className="flex h-full flex-col rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <div className="flex gap-0.5 text-brand" aria-label={`${r.rating} sao`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                “{r.content}”
              </blockquote>
              <figcaption className="mt-4 border-t border-paper-line pt-4 text-sm">
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-ink-muted">
                  {r.location} · {r.vehicle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
