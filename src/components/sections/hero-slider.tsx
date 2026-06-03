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
const TRANSITION_MS = 800;

export function HeroSlider({ slides: cmsSlides }: { slides?: CmsHeroSlide[] }) {
  const slides: Slide[] =
    cmsSlides && cmsSlides.length > 0
      ? cmsSlides.map((s) => ({ src: s.imageUrl, alt: s.imageAlt || s.title }))
      : FALLBACK_SLIDES;

  const [index, setIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const track = [...slides, slides[0]];

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setTransitionOn(true);
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const handleTransitionEnd = () => {
    if (index !== slides.length) return;
    setTransitionOn(false);
    setIndex(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitionOn(true)));
  };

  const goTo = (i: number) => {
    setTransitionOn(true);
    setIndex(i);
  };

  return (
    <div className="relative w-full overflow-hidden bg-ink">
      <div
        className="flex w-full will-change-transform"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: transitionOn ? `transform ${TRANSITION_MS}ms ease-in-out` : "none",
        }}
      >
        {track.map((slide, i) => (
          <div key={i} className="w-full shrink-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={823}
              sizes="100vw"
              priority={i === 0}
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
          {slides.map((_, i) => {
            const active = index % slides.length === i;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Chuyển tới slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  active ? "w-8 bg-brand" : "w-4 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
