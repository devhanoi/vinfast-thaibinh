import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Check, Route } from "lucide-react";
import { CARS } from "@/content/cars";
import { formatVND } from "@/lib/utils";
import type { CmsProduct } from "@/server/cms/types";
import { extractCarColors, type CarColor } from "@/lib/car-colors";

export function CarGrid({ cars }: { cars?: CmsProduct[] }) {
  const items: CmsProduct[] =
    cars ??
    CARS.map((car, index) => ({
      ...car,
      category: "car",
      segment: car.segment ?? null,
      tagline: null,
      battery: car.battery ?? null,
      rangeKm: car.rangeKm ?? null,
      rangeText: null,
      specs: {},
      status: "active",
      sortOrder: index + 1,
      imageAlt: `${car.name} tại VinFast Thái Bình`,
      images: [
        {
          id: `${car.id}-fb`,
          url: car.image,
          key: null,
          alt: `${car.name} tại VinFast Thái Bình`,
          color: null,
          angle: null,
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    }));

  return (
    <section id="dong-xe" className="bg-paper-soft section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">6 dòng xe ô tô điện VinFast</p>
          <h2 className="mt-3 h-section text-ink">
            Chọn mẫu xe VinFast phù hợp tại Thái Bình
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Từ VF 3 đô thị 299 triệu đến VF 9 7 chỗ cao cấp 1.499 tỷ — đầy đủ phân khúc, sẵn xe
            trưng bày và xe lái thử tại showroom Đại Lộ Kỳ Đồng.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarCard({ car }: { car: CmsProduct }) {
  const rangeText = car.rangeKm ? `${car.rangeKm} km` : (car.rangeText ?? "—");
  const highlights = (car.highlights ?? []).slice(0, 3);
  const colors = extractCarColors(car.images ?? []);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-soft p-4">
        <Image
          src={car.image}
          alt={car.imageAlt ?? `${car.name} – ${car.segment} tại VinFast Thái Bình`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
        {car.segment && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {car.segment}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-ink">{car.name}</h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {car.battery && (
            <SpecChip icon={<BatteryCharging size={12} aria-hidden />} label={car.battery} />
          )}
          {rangeText !== "—" && (
            <SpecChip icon={<Route size={12} aria-hidden />} label={rangeText} />
          )}
        </div>

        {colors.length > 0 && <ColorSwatches colors={colors} />}

        {highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2 border-t border-paper-line pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Giá từ
            </span>
            <span className="font-display text-2xl font-extrabold leading-none text-brand">
              {formatVND(car.priceFrom)}
            </span>
          </div>
          <Link
            href={`/xe/${car.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Xem chi tiết
            <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SpecChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-paper-line bg-paper-soft px-2 py-0.5 text-xs font-medium text-ink-soft">
      {icon}
      {label}
    </span>
  );
}

function ColorSwatches({ colors }: { colors: CarColor[] }) {
  const MAX = 6;
  const visible = colors.slice(0, MAX);
  const overflow = colors.length - visible.length;
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {colors.length} màu
      </span>
      <div className="flex items-center gap-1">
        {visible.map((c) => (
          <span
            key={c.slug}
            title={c.label}
            aria-label={c.label}
            className={`h-4 w-4 rounded-full shadow-sm transition ${
              c.isLight ? "ring-1 ring-paper-line" : "ring-1 ring-white/30"
            }`}
            style={{ background: c.gradient ?? c.hex }}
          />
        ))}
        {overflow > 0 && (
          <span className="ml-0.5 text-[11px] font-medium text-ink-muted">+{overflow}</span>
        )}
      </div>
    </div>
  );
}
