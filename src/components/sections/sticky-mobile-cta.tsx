"use client";

import { Phone, MessageCircle, FileText } from "lucide-react";
import { SITE } from "@/lib/site";

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper-line bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-3 text-xs font-semibold">
        <a
          href={`tel:${SITE.hotlineE164}`}
          className="flex flex-col items-center gap-1 py-2.5 text-brand"
        >
          <Phone size={18} aria-hidden /> Gọi ngay
        </a>
        <a
          href={SITE.social.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-paper-line py-2.5 text-ink-soft"
        >
          <MessageCircle size={18} aria-hidden /> Chat Zalo
        </a>
        <a
          href="#bao-gia"
          className="flex flex-col items-center gap-1 py-2.5 text-ink-soft"
        >
          <FileText size={18} aria-hidden /> Báo giá
        </a>
      </div>
    </div>
  );
}
