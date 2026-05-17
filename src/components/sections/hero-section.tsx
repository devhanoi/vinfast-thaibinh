import Image from "next/image";
import { ShieldCheck, BadgePercent, Car, Wrench } from "lucide-react";
import { SITE } from "@/lib/site";

const TRUST = [
  { icon: ShieldCheck, label: "Đại lý 3S" },
  { icon: Car, label: "Bảo hành 7 năm" },
  { icon: BadgePercent, label: "Trả góp 80%" },
  { icon: Wrench, label: "Giao xe 7 ngày" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cars/vf-3-1.webp"
          alt="Showroom xưởng dịch vụ VinFast Thái Bình"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/80 to-transparent" />
      </div>
      <div className="container-page relative grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-28">
        <div>
          <p className="eyebrow text-brand">Đại lý ủy quyền VinFast 3S · TP. Thái Bình</p>
          <h1 className="mt-4 h-display text-white">
            Đại lý VinFast Thái Bình
            <span className="block text-brand">Showroom 3S chính hãng</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
            Báo giá xe điện VF 3, VF 5, VF 6, VF 7, VF 8, VF 9 cập nhật tháng mới nhất. Trả góp tới
            80%, lái thử miễn phí trong bán kính 50km, bảo hành chính hãng 7 năm / 160.000 km.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#bao-gia" className="btn-primary px-7 py-3.5 text-base">
              Nhận báo giá ngay
            </a>
            <a href="#lai-thu" className="btn-ghost border-white/30 bg-white/10 px-7 py-3.5 text-base text-white hover:border-white hover:bg-white hover:text-ink">
              Đặt lịch lái thử
            </a>
          </div>
          <p className="mt-5 text-sm text-white/70">
            Hoặc gọi trực tiếp{" "}
            <a href={`tel:${SITE.hotlineE164}`} className="font-semibold text-brand underline-offset-4 hover:underline">
              {SITE.hotline}
            </a>{" "}
            – {SITE.salesRep.name}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {TRUST.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm font-medium text-white backdrop-blur md:py-5 md:text-base"
            >
              <Icon className="shrink-0 text-brand" size={22} aria-hidden />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
