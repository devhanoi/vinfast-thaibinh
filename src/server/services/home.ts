import "server-only";
import { unstable_cache } from "next/cache";
import { hasDatabaseUrl } from "@/server/db/prisma";
import { listProducts } from "./products";
import { listHeroSlides } from "./hero";
import { listFaqs } from "./faqs";
import { listTestimonials } from "./testimonials";
import { listChargingByDistrict, listChargingStations } from "./charging";
import { getSeo } from "./seo";
import { getStoreSettings } from "./store";
import { getFallbackHomePageData } from "@/server/cms/fallback";
import type {
  CmsChargingStation,
  CmsFaq,
  CmsHeroSlide,
  CmsProduct,
  CmsSeo,
  CmsTestimonial,
  HomePageData,
  SiteSettings,
} from "@/server/cms/types";
import type {
  ChargingStationEntityT,
  FaqEntityT,
  HeroSlideEntityT,
  ProductEntityT,
  SeoEntityT,
  StoreSettingsEntityT,
  TestimonialEntityT,
} from "@/lib/zod";

function toCmsProduct(p: ProductEntityT): CmsProduct {
  const primary = p.images.find((img) => img.isPrimary) ?? p.images[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    segment: p.segment,
    tagline: p.tagline,
    priceFrom: p.priceFrom,
    battery: p.battery,
    rangeKm: p.rangeKm,
    rangeText: p.rangeText,
    specs: p.specs,
    highlights: p.highlights,
    status: p.status,
    sortOrder: p.sortOrder,
    image: primary?.url ?? "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
    imageAlt: primary?.alt ?? `${p.name} tại VinFast Thái Bình`,
    images: p.images,
  };
}

function toCmsHero(h: HeroSlideEntityT): CmsHeroSlide {
  return h;
}

function toCmsFaq(f: FaqEntityT): CmsFaq {
  return f;
}

function toCmsTestimonial(t: TestimonialEntityT): CmsTestimonial {
  return t;
}

function toCmsStation(s: ChargingStationEntityT): CmsChargingStation {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    district: s.district,
    mapUrl: s.mapUrl,
    isActive: s.isActive,
    sortOrder: s.sortOrder,
  };
}

function toCmsSeo(s: SeoEntityT | null, fallback: CmsSeo): CmsSeo {
  return s ?? fallback;
}

function toCmsSite(s: StoreSettingsEntityT): SiteSettings {
  return s as unknown as SiteSettings;
}

async function fetchHomePageData(): Promise<HomePageData> {
  const fallback = getFallbackHomePageData();
  const [site, seo, heroSlides, products, faqs, testimonials, stations, stationGroups] = await Promise.all([
    getStoreSettings().catch(() => fallback.site as unknown as StoreSettingsEntityT),
    getSeo("home").catch(() => null),
    listHeroSlides(false).catch(() => []),
    listProducts({ active: true }).catch(() => []),
    listFaqs(false).catch(() => []),
    listTestimonials(false).catch(() => []),
    listChargingStations(false).catch(() => []),
    listChargingByDistrict().catch(() => []),
  ]);

  const cmsProducts = products.map(toCmsProduct);

  return {
    site: toCmsSite(site),
    seo: toCmsSeo(seo, fallback.seo),
    heroSlides: heroSlides.length ? heroSlides.map(toCmsHero) : fallback.heroSlides,
    products: cmsProducts,
    cars: cmsProducts.filter((p) => p.category === "car"),
    serviceCars: cmsProducts.filter((p) => p.category === "service_car"),
    bikes: cmsProducts.filter((p) => p.category === "bike"),
    faqs: faqs.length ? faqs.map(toCmsFaq) : fallback.faqs,
    testimonials: testimonials.length ? testimonials.map(toCmsTestimonial) : fallback.testimonials,
    chargingStations: stationGroups.length
      ? stationGroups.map((g) => ({ district: g.district, stations: g.stations.map(toCmsStation) }))
      : fallback.chargingStations,
    totalStations: stations.length || fallback.totalStations,
  };
}

export const getHomePageData = unstable_cache(
  async (): Promise<HomePageData> => {
    if (!hasDatabaseUrl()) return getFallbackHomePageData();
    try {
      return await fetchHomePageData();
    } catch (err) {
      console.error("[home-service] fallback", err);
      return getFallbackHomePageData();
    }
  },
  ["home-page-data-v2"],
  { revalidate: 300, tags: ["cms", "home"] },
);
