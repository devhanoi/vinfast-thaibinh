import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/sections/site-header";
import { ContactFooter } from "@/components/sections/contact-footer";
import { TestDriveForm } from "@/components/sections/test-drive-form";
import { getHomePageData, getProductBySlug } from "@/server/cms/data";
import { SITE } from "@/lib/site";
import { formatVND } from "@/lib/utils";

type PageProps = { params: { slug: string } };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} tại VinFast Thái Bình`,
    description: `${product.name} ${product.segment ?? ""} giá từ ${formatVND(product.priceFrom)}. Xem ảnh, thông số, ưu đãi trả góp và đặt lịch lái thử tại VinFast Thái Bình.`,
    alternates: { canonical: `/xe/${product.slug}` },
    openGraph: {
      title: `${product.name} tại VinFast Thái Bình`,
      description: `${product.name} giá từ ${formatVND(product.priceFrom)} - tư vấn trả góp và lái thử miễn phí.`,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.imageAlt }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const [product, home] = await Promise.all([getProductBySlug(params.slug), getHomePageData()]);
  if (!product || product.status !== "active") notFound();
  const related = home.cars.filter((item) => item.slug !== product.slug).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/xe/${product.slug}#product`,
    name: product.name,
    description: `${product.name} ${product.segment ?? ""} tại VinFast Thái Bình.`,
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: "VinFast" },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/xe/${product.slug}`,
      priceCurrency: "VND",
      price: product.priceFrom,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Script id={`product-jsonld-${product.slug}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(schema)}
      </Script>
      <SiteHeader site={home.site} />
      <main>
        <section className="bg-ink py-12 text-white md:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Link href="/#dong-xe" className="text-sm font-semibold text-brand hover:underline">
                Quay lại danh sách xe
              </Link>
              <h1 className="mt-5 h-display text-white">{product.name}</h1>
              <p className="mt-4 max-w-2xl text-lg text-white/75">{product.segment ?? product.tagline}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#bao-gia" className="btn-primary px-7 py-3.5 text-base">Nhận báo giá</a>
                <a href={`tel:${home.site.hotlineE164}`} className="btn-ghost border-white/30 bg-white/10 px-7 py-3.5 text-base text-white hover:border-white hover:bg-white hover:text-ink">
                  Gọi {home.site.hotline}
                </a>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5">
              <Image src={product.image} alt={product.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <p className="text-sm uppercase tracking-wide text-ink-muted">Giá từ</p>
              <p className="mt-1 font-display text-3xl font-bold text-brand">{formatVND(product.priceFrom)}</p>
              <dl className="mt-6 grid gap-4 text-sm">
                <div><dt className="text-ink-muted">Pin</dt><dd className="font-semibold text-ink">{product.battery ?? "Đang cập nhật"}</dd></div>
                <div><dt className="text-ink-muted">Quãng đường</dt><dd className="font-semibold text-ink">{product.rangeKm ? `${product.rangeKm} km` : product.rangeText ?? "Đang cập nhật"}</dd></div>
                <div><dt className="text-ink-muted">Phân khúc</dt><dd className="font-semibold text-ink">{product.segment ?? "Đang cập nhật"}</dd></div>
              </dl>
            </aside>
            <div>
              <h2 className="h-section text-ink">Thông tin nổi bật</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-2xl border border-paper-line bg-white p-5 text-sm font-medium text-ink shadow-card">
                    {highlight}
                  </div>
                ))}
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {product.images.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-paper-soft">
                    <Image src={image.url} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-paper-soft section">
            <div className="container-page">
              <h2 className="h-section text-ink">Dòng xe liên quan</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.slug} href={`/xe/${item.slug}`} className="overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card transition hover:-translate-y-1">
                    <div className="relative aspect-[16/10]">
                      <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-ink">{item.name}</h3>
                      <p className="mt-1 text-sm text-brand">{formatVND(item.priceFrom)}</p>
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
