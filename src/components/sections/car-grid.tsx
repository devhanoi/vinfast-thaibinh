import Image from "next/image";
import { CARS } from "@/content/cars";
import { formatVND } from "@/lib/utils";

export function CarGrid() {
  return (
    <section id="dong-xe" className="bg-paper-soft section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">6 dòng xe ô tô điện VinFast</p>
          <h2 className="mt-3 h-section text-ink">
            Chọn mẫu xe VinFast phù hợp tại Thái Bình
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Từ VF 3 đô thị 299 triệu đến VF 9 7 chỗ cao cấp 1.499 tỷ – đầy đủ phân khúc, sẵn xe
            trưng bày và xe lái thử tại showroom Đại Lộ Kỳ Đồng.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car) => (
            <article
              key={car.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-soft">
                <Image
                  src={car.image}
                  alt={`${car.name} – ${car.segment} bán tại VinFast Thái Bình`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">{car.name}</h3>
                  <p className="text-sm text-ink-muted">{car.segment}</p>
                </div>
                <ul className="space-y-1.5 text-sm text-ink-soft">
                  <li>· Pin {car.battery} – {car.rangeKm} km / lần sạc</li>
                  {car.highlights.slice(0, 2).map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">Giá từ</p>
                    <p className="font-display text-2xl font-bold text-brand">{formatVND(car.priceFrom)}</p>
                  </div>
                  <a href="#bao-gia" className="btn-dark px-4 py-2 text-xs">Báo giá</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
