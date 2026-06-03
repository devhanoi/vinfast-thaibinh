import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ChevronRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/sections/site-header";
import { ContactFooter } from "@/components/sections/contact-footer";
import { TestDriveForm } from "@/components/sections/test-drive-form";
import { ProductGallery } from "@/components/product/gallery";
import { SpecTable } from "@/components/product/spec-table";
import { Streamdown } from "streamdown";
import { getHomePageData, getProductBySlug } from "@/server/cms/data";
import { SITE } from "@/lib/site";
import { formatVND } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const priceText = formatVND(product.priceFrom);
  return {
    title: `${product.name} Thái Bình – Giá lăn bánh từ ${priceText} | ${SITE.hotline}`,
    description: `${product.name} ${product.segment ?? ""} tại VinFast Thái Bình. Pin ${product.battery ?? "—"}, quãng đường ${product.rangeKm ?? "—"} km. Báo giá lăn bánh, trả góp 80%, lái thử miễn phí. Hotline ${SITE.hotline}.`.slice(0, 160),
    alternates: { canonical: `/xe/${product.slug}` },
    openGraph: {
      title: `${product.name} tại VinFast Thái Bình`,
      description: `${product.name} giá từ ${priceText}. Tư vấn trả góp + lái thử miễn phí.`,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.imageAlt }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, home] = await Promise.all([getProductBySlug(slug), getHomePageData()]);
  if (!product || product.status !== "active") notFound();

  const related = home.cars.filter((item) => item.slug !== product.slug).slice(0, 4);
  const url = `${SITE.url}/xe/${product.slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: `${product.name} ${product.segment ?? ""} tại VinFast Thái Bình. Pin ${product.battery ?? ""}, quãng đường ${product.rangeKm ?? ""} km.`,
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: "VinFast" },
    model: product.name,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "VND",
      price: product.priceFrom,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE.url}/#dealer` },
    },
    additionalProperty: [
      product.battery && {
        "@type": "PropertyValue",
        name: "Dung lượng pin",
        value: product.battery,
      },
      product.rangeKm && {
        "@type": "PropertyValue",
        name: "Quãng đường",
        value: `${product.rangeKm} km`,
      },
    ].filter(Boolean),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Dòng xe", item: `${SITE.url}/#dong-xe` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <Script
        id={`product-jsonld-${product.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id={`product-breadcrumb-${product.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader site={home.site} />

      <main>
        <nav
          className="container-page flex items-center gap-1.5 py-4 text-xs text-ink-muted md:py-5 md:text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink">Trang chủ</Link>
          <ChevronRight size={14} className="text-ink-muted/60" aria-hidden />
          <Link href="/#dong-xe" className="hover:text-ink">Dòng xe</Link>
          <ChevronRight size={14} className="text-ink-muted/60" aria-hidden />
          <span className="font-semibold text-ink">{product.name}</span>
        </nav>

        <section className="container-page grid gap-8 pb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <ProductGallery images={product.images} />
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="eyebrow text-brand">{product.segment ?? "Xe điện VinFast"}</p>
            <h1 className="mt-2 h-section text-ink">{product.name}</h1>
            {product.tagline && (
              <p className="mt-3 text-base text-ink-muted">{product.tagline}</p>
            )}

            <div className="mt-6 rounded-2xl border border-paper-line bg-white p-5 shadow-card">
              <p className="text-xs uppercase tracking-wider text-ink-muted">Giá niêm yết từ</p>
              <p className="mt-1 font-display text-3xl font-bold text-brand">
                {formatVND(product.priceFrom)}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Chưa gồm phí trước bạ + đăng ký. Liên hệ báo giá lăn bánh chính xác.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <a href="#bao-gia" className="btn-primary w-full px-5 py-3 text-base">
                  Nhận báo giá lăn bánh
                </a>
                <a
                  href="#lai-thu"
                  className="btn-ghost w-full border-paper-line bg-white px-5 py-3 text-base text-ink hover:border-ink"
                >
                  Đặt lịch lái thử
                </a>
                <a
                  href={`tel:${home.site.hotlineE164}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-5 py-3 text-sm font-semibold text-brand hover:bg-brand/10"
                >
                  <Phone size={16} aria-hidden /> Gọi {home.site.hotline}
                </a>
              </div>
            </div>

            {product.highlights.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Điểm nổi bật
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                        aria-hidden
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>

        {product.description && (
          <section className="section">
            <div className="container-page max-w-4xl">
              <h2 className="h-section text-ink">Giới thiệu {product.name}</h2>
              <div className="streamdown-content mt-6 text-base leading-relaxed text-ink-soft">
                <Streamdown>{product.description}</Streamdown>
              </div>
            </div>
          </section>
        )}

        <section className="bg-paper-soft section">
          <div className="container-page max-w-4xl">
            <h2 className="h-section text-ink">Thông số kỹ thuật</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Thông số tham khảo của {product.name}. Liên hệ {home.site.hotline} để được tư vấn
              chi tiết theo phiên bản và năm sản xuất.
            </p>
            <div className="mt-6">
              <SpecTable product={product} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section">
            <div className="container-page">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="h-section text-ink">Dòng xe liên quan</h2>
                  <p className="mt-2 text-sm text-ink-muted">
                    Các mẫu xe VinFast khác cùng phân khúc hoặc đang được khách hàng quan tâm.
                  </p>
                </div>
                <Link
                  href="/#dong-xe"
                  className="hidden text-sm font-semibold text-brand hover:underline md:inline"
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/xe/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-ink-muted">
                        {item.segment ?? "Xe điện"}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold text-ink">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-brand">
                        Từ {formatVND(item.priceFrom)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <TestDriveForm cars={home.cars} />
      </main>

      <ContactFooter site={home.site} />
    </>
  );
}
