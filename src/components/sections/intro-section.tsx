import { SITE } from "@/lib/site";
import type { SiteSettings } from "@/server/cms/types";

export function IntroSection({ site = SITE }: { site?: SiteSettings }) {
  return (
    <section
      id="gioi-thieu"
      className="relative bg-ink text-white"
      aria-labelledby="intro-heading"
    >
      <div className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow text-brand">Đại lý ủy quyền VinFast · TP. Thái Bình</p>
          <h1 id="intro-heading" className="mt-3 h-display text-white">
            Đại lý VinFast Thái Bình
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            VF 3 · VF 5 · VF 6 · VF 7 · VF 8 · VF 9 — báo giá cập nhật, trả góp 80%, lái thử
            miễn phí trong bán kính 50&nbsp;km quanh TP. Thái Bình.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#bao-gia" className="btn-primary px-6 py-3 text-base">
              Nhận báo giá
            </a>
            <a
              href="#lai-thu"
              className="btn-ghost border-white/30 bg-white/10 px-6 py-3 text-base text-white hover:border-white hover:bg-white hover:text-ink"
            >
              Đặt lịch lái thử
            </a>
            <a
              href={`tel:${site.hotlineE164}`}
              className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              Hoặc gọi {site.hotline}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
