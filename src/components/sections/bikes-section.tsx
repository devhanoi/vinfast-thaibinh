import { BIKES } from "@/content/cars";
import { formatVND } from "@/lib/utils";
import { Bike } from "lucide-react";

export function BikesSection() {
  return (
    <section id="xe-may" className="bg-paper-soft section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">Xe máy điện VinFast</p>
            <h2 className="mt-3 h-section text-ink">Phân phối đủ dải xe máy điện tại Thái Bình</h2>
          </div>
          <a href="#lien-he" className="btn-ghost text-xs">Xem chi tiết xe máy</a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BIKES.map((bike) => (
            <div key={bike.id} className="flex items-center gap-4 rounded-2xl border border-paper-line bg-white p-5 shadow-card">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                <Bike size={22} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-bold text-ink truncate">{bike.name}</p>
                <p className="text-xs text-ink-muted">{bike.range}</p>
                <p className="mt-1 text-sm font-semibold text-brand">{formatVND(bike.priceFrom)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
