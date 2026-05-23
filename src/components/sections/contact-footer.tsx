import { MapPin, Phone, Mail, Clock, Facebook, Youtube } from "lucide-react";
import { SITE } from "@/lib/site";
import type { SiteSettings } from "@/server/cms/types";

export function ContactFooter({ site = SITE }: { site?: SiteSettings }) {
  return (
    <footer id="lien-he" className="bg-ink text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <p className="eyebrow text-brand">Liên hệ trực tiếp</p>
          <h2 className="mt-3 h-section text-white">{site.name}</h2>
          <p className="mt-3 text-sm text-white/70">{site.legalName}</p>
          <ul className="mt-6 space-y-4 text-sm text-white/85">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              {site.address.street}, {site.address.ward}, {site.address.city}
            </li>
            <li className="flex gap-3"><Phone size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <a href={`tel:${site.hotlineE164}`} className="hover:text-brand">{site.hotline}</a>
            </li>
            <li className="flex gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <a href={`mailto:${site.email}`} className="hover:text-brand">{site.email}</a>
            </li>
            <li className="flex gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <span>
                T2–T7: 07:30–18:30
                <br />Chủ nhật: 08:00–17:00
              </span>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-3">
            <SocialLink href={site.social.facebook} label="Facebook"><Facebook size={18} aria-hidden /></SocialLink>
            <SocialLink href={site.social.youtube} label="YouTube"><Youtube size={18} aria-hidden /></SocialLink>
            <SocialLink href={site.social.zalo} label="Zalo">
              <span className="text-xs font-bold">Zalo</span>
            </SocialLink>
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Sản phẩm</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><a href="#dong-xe" className="hover:text-brand">Ô tô điện VinFast VF 3 → VF 9</a></li>
            <li><a href="#xe-dich-vu" className="hover:text-brand">Xe điện chạy dịch vụ Green</a></li>
            <li><a href="#xe-may" className="hover:text-brand">Xe máy điện VinFast</a></li>
            <li><a href="#bang-gia" className="hover:text-brand">Bảng giá tháng mới nhất</a></li>
            <li><a href="#tra-gop" className="hover:text-brand">Thủ tục trả góp 80%</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Bản đồ showroom</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title={`Bản đồ ${site.name}`}
              src="https://www.google.com/maps?q=Dai+Lo+Ky+Dong+Thai+Binh&output=embed"
              loading="lazy"
              className="h-[220px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {site.legalName}. Website thông tin đại lý, không thuộc sở
        hữu của VinFast Trading and Production JSC.
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand hover:bg-brand hover:text-white"
    >
      {children}
    </a>
  );
}
