import Image from "next/image";
import { SERVICE_CARS } from "@/content/cars";
import { formatVND } from "@/lib/utils";

export function ServiceCarsSection() {
  return (
    <section id="xe-dich-vu" className="section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Xe điện chạy dịch vụ</p>
          <h2 className="mt-3 h-section text-ink">Đầu tư đội xe Xanh SM tại Thái Bình</h2>
          <p className="mt-3 text-base text-ink-muted">
            Ba dòng Green chuyên dụng dành cho tài xế và doanh nghiệp vận tải: chi phí điện chỉ
            bằng 1/3 xăng, miễn phí sạc tại trạm V-Green trong 2 năm đầu.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SERVICE_CARS.map((car) => (
            <article key={car.id} className="overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
              <div className="relative aspect-[16/10]">
                <Image
                  src={car.image}
                  alt={`${car.name} – ${car.tagline} tại VinFast Thái Bình`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-ink">{car.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{car.tagline}</p>
                <p className="mt-3 font-display text-xl font-bold text-brand">Từ {formatVND(car.priceFrom)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
