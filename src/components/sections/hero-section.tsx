import type { CmsHeroSlide } from "@/server/cms/types";
import { HeroSlider } from "./hero-slider";

export function HeroSection({ slides }: { slides?: CmsHeroSlide[] }) {
  return (
    <section
      aria-label="VinFast Thái Bình – ảnh xe điện mới nhất"
      className="relative isolate overflow-hidden bg-ink"
    >
      {/* h1 ẩn cho SEO + screen reader — landing không có heading hiển thị */}
      <h1 className="sr-only">Đại lý ủy quyền VinFast Thái Bình</h1>
      <HeroSlider slides={slides} />
    </section>
  );
}
