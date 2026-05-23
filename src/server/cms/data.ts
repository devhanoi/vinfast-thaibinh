import "server-only";
import { unstable_cache } from "next/cache";
import { prisma, hasDatabaseUrl } from "@/server/db/prisma";
import { getFallbackHomePageData } from "./fallback";
import type { CmsChargingStation, CmsProduct, HomePageData, SiteSettings } from "./types";

type ProductWithImages = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  images: {
    id: string;
    url: string;
    key: string | null;
    alt: string;
    color: string | null;
    angle: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function mapProduct(product: ProductWithImages): CmsProduct {
  const primary = product.images.find((image) => image.isPrimary) ?? product.images[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    segment: product.segment,
    tagline: product.tagline,
    priceFrom: product.priceFrom,
    battery: product.battery,
    rangeKm: product.rangeKm,
    rangeText: product.rangeText,
    specs: toRecord(product.specsJson),
    highlights: toStringArray(product.highlightsJson),
    status: product.status,
    sortOrder: product.sortOrder,
    image: primary?.url ?? "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
    imageAlt: primary?.alt ?? `${product.name} tại VinFast Thái Bình`,
    images: product.images,
  };
}

function groupStations(stations: CmsChargingStation[]) {
  const map = new Map<string, CmsChargingStation[]>();
  for (const station of stations) {
    const items = map.get(station.district) ?? [];
    items.push(station);
    map.set(station.district, items);
  }
  return Array.from(map, ([district, items]) => ({ district, stations: items }));
}

async function getHomePageDataFromDb(): Promise<HomePageData> {
  const [siteSetting, seo, heroSlides, products, faqs, testimonials, stations] = await Promise.all([
    prisma.storeSetting.findUnique({ where: { key: "site" } }),
    prisma.seoSetting.findUnique({ where: { pageKey: "home" } }),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }] }),
    prisma.product.findMany({
      where: { status: "active" },
      include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.faq.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }] }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }] }),
    prisma.chargingStation.findMany({ where: { isActive: true }, orderBy: [{ district: "asc" }, { sortOrder: "asc" }] }),
  ]);

  const fallback = getFallbackHomePageData();
  const mappedProducts = products.map(mapProduct);
  const mappedStations = stations.map((station) => ({
    ...station,
    mapUrl: station.mapUrl,
    isActive: station.isActive,
    sortOrder: station.sortOrder,
  }));

  return {
    site: (siteSetting?.valueJson as SiteSettings | undefined) ?? fallback.site,
    seo: seo ?? fallback.seo,
    heroSlides: heroSlides.length ? heroSlides : fallback.heroSlides,
    products: mappedProducts,
    cars: mappedProducts.filter((product) => product.category === "car"),
    serviceCars: mappedProducts.filter((product) => product.category === "service_car"),
    bikes: mappedProducts.filter((product) => product.category === "bike"),
    faqs: faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      sortOrder: faq.sortOrder,
    })),
    testimonials: testimonials.map((item) => ({
      id: item.id,
      name: item.name,
      content: item.content,
      rating: item.rating,
      location: item.location,
      vehicle: item.vehicle,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    })),
    chargingStations: groupStations(mappedStations),
    totalStations: stations.length,
  };
}

export const getHomePageData = unstable_cache(
  async () => {
    if (!hasDatabaseUrl()) return getFallbackHomePageData();
    try {
      return await getHomePageDataFromDb();
    } catch (error) {
      console.error("[cms] falling back to static homepage data", error);
      return getFallbackHomePageData();
    }
  },
  ["home-page-data"],
  { revalidate: 300, tags: ["cms", "home"] }
);

export async function getProducts(filters: { status?: "active" | "draft" | "archived"; category?: CmsProduct["category"] } = {}) {
  if (!hasDatabaseUrl()) return getFallbackHomePageData().products;
  const products = await prisma.product.findMany({
    where: {
      status: filters.status,
      category: filters.category,
    },
    include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } },
    orderBy: [{ sortOrder: "asc" }],
  });
  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return getFallbackHomePageData().products.find((product) => product.slug === slug) ?? null;
  }
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } },
  });
  return product ? mapProduct(product) : null;
}

export async function getStoreSettings() {
  return (await getHomePageData()).site;
}

export async function getSeoSettings(pageKey: string) {
  if (!hasDatabaseUrl()) return getFallbackHomePageData().seo;
  return prisma.seoSetting.findUnique({ where: { pageKey } });
}
