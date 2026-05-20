import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { SITE } from "@/lib/site";
import { buildAllSchemas } from "@/lib/schema";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Đại lý ủy quyền chính hãng – ${SITE.hotline}`,
    template: `%s | ${SITE.name}`,
  },
  description: `Đại lý ủy quyền VinFast Thái Bình chính hãng tại Đại Lộ Kỳ Đồng – báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí. Hotline ${SITE.hotline}.`,
  applicationName: SITE.name,
  generator: "Next.js",
  keywords: [
    "vinfast thái bình",
    "đại lý vinfast thái bình",
    "showroom vinfast thái bình",
    "giá xe vinfast thái bình",
    "lái thử vinfast thái bình",
    "trả góp vinfast thái bình",
    "vinfast vf3 thái bình",
    "vinfast vf5 thái bình",
    "vinfast vf6 thái bình",
    "vinfast vf7 thái bình",
    "vinfast vf8 thái bình",
    "vinfast vf9 thái bình",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Đại lý ủy quyền chính hãng – Báo giá tháng mới nhất`,
    description: `Showroom VinFast chính hãng tại TP. Thái Bình – báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí. Gọi ${SITE.hotline}.`,
    locale: "vi_VN",
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: `Showroom ${SITE.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Đại lý ủy quyền chính hãng`,
    description: `Báo giá xe điện VinFast, trả góp 80%, lái thử miễn phí tại TP. Thái Bình. Hotline ${SITE.hotline}.`,
    images: ["/images/og-cover.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? undefined },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemas = buildAllSchemas();
  return (
    <html lang="vi" className={beVietnam.variable}>
      <head>
        {schemas.map((schema, i) => (
          <Script
            key={i}
            id={`ld-${i}`}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
