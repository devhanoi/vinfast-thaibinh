"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { CmsProductImage } from "@/server/cms/types";

type GalleryImage = Pick<CmsProductImage, "id" | "url" | "alt" | "color" | "angle" | "isPrimary">;

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const colors = useMemo(() => {
    const set = new Set<string>();
    for (const img of images) if (img.color) set.add(img.color);
    return Array.from(set);
  }, [images]);

  const [activeColor, setActiveColor] = useState<string | null>(null);
  const visible = useMemo(
    () => (activeColor ? images.filter((img) => img.color === activeColor) : images),
    [images, activeColor],
  );

  const [dialogIndex, setDialogIndex] = useState<number | null>(null);
  const isOpen = dialogIndex !== null;
  const dialogImage = isOpen ? visible[dialogIndex!] : null;

  const close = () => setDialogIndex(null);
  const prev = () =>
    setDialogIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length));
  const next = () =>
    setDialogIndex((i) => (i === null ? null : (i + 1) % visible.length));

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, visible.length]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (visible.length === 0) return null;
  const hero = visible[0];

  return (
    <div>
      {colors.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Màu xe:
          </span>
          <button
            type="button"
            onClick={() => setActiveColor(null)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              activeColor === null
                ? "border-ink bg-ink text-white"
                : "border-paper-line bg-white text-ink hover:border-ink"
            }`}
          >
            Tất cả ({images.length})
          </button>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveColor(c)}
              className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
                activeColor === c
                  ? "border-ink bg-ink text-white"
                  : "border-paper-line bg-white text-ink hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setDialogIndex(0)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-paper-soft"
        aria-label="Mở thư viện ảnh phóng to"
      >
        <Image
          src={hero.url}
          alt={hero.alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
          <ZoomIn size={18} />
        </div>
      </button>

      {visible.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
          {visible.slice(1, 13).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setDialogIndex(i + 1)}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-soft transition hover:opacity-80"
              aria-label={`Xem ${img.alt}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 15vw, 25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {dialogImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thư viện ảnh xe"
          onClick={close}
          onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const delta = (e.changedTouches[0]?.clientX ?? touchStart) - touchStart;
            if (delta > 50) prev();
            else if (delta < -50) next();
            setTouchStart(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          <div className="absolute left-4 top-4 z-10 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white">
            {dialogIndex! + 1} / {visible.length}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>

          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
                aria-label="Ảnh sau"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-[92vw] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={dialogImage.url}
              alt={dialogImage.alt}
              fill
              sizes="92vw"
              priority
              className="object-contain"
            />
          </div>

          {visible.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 gap-2 md:flex">
              {visible.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDialogIndex(i);
                  }}
                  className={`relative h-14 w-20 overflow-hidden rounded transition ${
                    i === dialogIndex
                      ? "ring-2 ring-brand"
                      : "opacity-50 hover:opacity-100"
                  }`}
                  aria-label={`Chuyển tới ảnh ${i + 1}`}
                >
                  <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
