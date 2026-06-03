"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CmsHeroSlide } from "@/server/cms/types";

type Slide = { src: string; alt: string };

const FALLBACK_SLIDES: Slide[] = [
  { src: "/images/slide/teasing-desktop_new.png", alt: "VinFast ra mắt dòng xe điện thế hệ mới" },
  { src: "/images/slide/vinfast-vf3-sanh-dieu-sang-tao-desktop.png", alt: "VinFast VF3 sành điệu, sáng tạo cho giới trẻ" },
  { src: "/images/slide/vf_8_the_he_moi_deskotp_new.jpg", alt: "VinFast VF8 thế hệ mới – SUV điện cao cấp" },
  { src: "/images/slide/vinfast-vf-mpv7-ban-dong-hanh-dai-gia-dinh-desktop.jpg", alt: "VinFast MPV7 đồng hành cùng đại gia đình" },
  { src: "/images/slide/vinfast-giai-phap-di-chuyen-xanh-ben-vung-desktop.jpg", alt: "VinFast – giải pháp di chuyển xanh bền vững" },
  { src: "/images/slide/vinfast-len-doi-xe-xanh-toi-uu-chi-phi-desktop.jpg", alt: "Lên đời xe xanh VinFast – tối ưu chi phí vận hành" },
  { src: "/images/slide/vinfast-dau-tu-0-dong-sinh-loi-tren-tung-km-desktop.jpg", alt: "Đầu tư 0 đồng, sinh lời trên từng km cùng VinFast" },
];

const AUTOPLAY_MS = 5000;
const FADE_MS = 800;

export function HeroSlider({ slides: cmsSlides }: { slides?: CmsHeroSlide[] }) {
  const slides: Slide[] =
    cmsSlides && cmsSlides.length > 0
      ? cmsSlides.map((s) => ({ src: s.imageUrl, alt: s.imageAlt || s.title }))
      : FALLBACK_SLIDES;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden bg-ink">
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
            pointerEvents: i === active ? "auto" : "none",
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-contain"
          />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Chuyển tới slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-brand" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
