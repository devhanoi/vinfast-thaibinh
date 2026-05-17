import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "#bang-gia", label: "Bảng giá" },
  { href: "#lai-thu", label: "Lái thử" },
  { href: "#tra-gop", label: "Trả góp" },
  { href: "#tram-sac", label: "Trạm sạc" },
  { href: "#lien-he", label: "Liên hệ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/80 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label={SITE.name}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white font-bold">VF</span>
          <span className="hidden font-display text-base font-bold text-ink sm:inline">
            {SITE.name}
            <span className="ml-1 text-xs font-medium text-ink-muted">| 3S</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition hover:text-brand">
              {n.label}
            </a>
          ))}
        </nav>
        <a href={`tel:${SITE.hotlineE164}`} className="btn-primary px-4 py-2 text-xs md:text-sm">
          <Phone size={16} aria-hidden /> {SITE.hotline}
        </a>
      </div>
    </header>
  );
}
