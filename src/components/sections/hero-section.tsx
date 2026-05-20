import { HeroSlider } from "./hero-slider";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <HeroSlider />
      <div className="container-page relative py-24 md:py-32 lg:py-40">
        <div className="max-w-lg">
          <p className="eyebrow text-brand">Đại lý ủy quyền VinFast · Thái Bình</p>
          <h1 className="mt-3 h-display text-white">VinFast Thái Bình</h1>
          <p className="mt-3 text-base text-white/90">
            VF 3 – VF 9 · Trả góp 80% · Lái thử miễn phí.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#bao-gia" className="btn-primary px-6 py-3 text-base">
              Nhận báo giá
            </a>
            <a
              href="#lai-thu"
              className="btn-ghost border-white/30 bg-white/10 px-6 py-3 text-base text-white hover:border-white hover:bg-white hover:text-ink"
            >
              Đặt lịch lái thử
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
