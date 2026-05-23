import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { VinFastLogo } from "@/components/brand/vinfast-logo";
import type { SiteSettings } from "@/server/cms/types";

const NAV = [
  { href: "#bang-gia", label: "Bảng giá" },
  { href: "#lai-thu", label: "Lái thử" },
  { href: "#tra-gop", label: "Trả góp" },
  { href: "#tram-sac", label: "Trạm sạc" },
  { href: "#lien-he", label: "Liên hệ" },
];

export function SiteHeader({ site = SITE }: { site?: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/80 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
          <VinFastLogo className="h-7" />
          <span className="hidden h-6 w-px bg-paper-line sm:block" aria-hidden />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Đại lý 3S</span>
            <span className="font-display text-sm font-bold text-ink">Thái Bình</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition hover:text-brand">
              {n.label}
            </a>
          ))}
        </nav>
        <a href={`tel:${site.hotlineE164}`} className="btn-primary px-4 py-2 text-xs md:text-sm">
          <Phone size={16} aria-hidden /> {site.hotline}
        </a>
      </div>
    </header>
  );
}
