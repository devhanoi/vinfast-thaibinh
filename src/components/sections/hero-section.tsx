import type { CmsHeroSlide } from "@/server/cms/types";
import { HeroSlider } from "./hero-slider";

export function HeroSection({ slides }: { slides?: CmsHeroSlide[] }) {
  return (
    <section
      aria-label="VinFast Thái Bình – ảnh xe điện mới nhất"
      className="relative isolate overflow-hidden bg-ink"
    >
      <HeroSlider slides={slides} />
    </section>
  );
}
