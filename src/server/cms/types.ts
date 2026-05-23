import type { SITE as DEFAULT_SITE } from "@/lib/site";

export type SiteSettings = typeof DEFAULT_SITE;

export type CmsProduct = {
  id: string;
  slug: string;
  name: string;
  category: "car" | "service_car" | "bike";
  segment: string | null;
  tagline: string | null;
  priceFrom: number;
  battery: string | null;
  rangeKm: number | null;
  rangeText: string | null;
  specs: Record<string, unknown>;
  highlights: string[];
  status: "draft" | "active" | "archived";
  sortOrder: number;
  image: string;
  imageAlt: string;
  images: CmsProductImage[];
};

export type CmsProductImage = {
  id: string;
  url: string;
  key: string | null;
  alt: string;
  color: string | null;
  angle: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type CmsHeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  isActive: boolean;
  sortOrder: number;
};

export type CmsFaq = { id: string; question: string; answer: string; isActive: boolean; sortOrder: number };
export type CmsTestimonial = {
  id: string;
  name: string;
  content: string;
  rating: number;
  location: string | null;
  vehicle: string | null;
  isActive: boolean;
  sortOrder: number;
};
export type CmsChargingStation = {
  id: string;
  name: string;
  address: string;
  district: string;
  mapUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type CmsSeo = {
  pageKey: string;
  title: string;
  description: string;
  ogImageUrl: string | null;
  canonicalPath: string;
};

export type HomePageData = {
  site: SiteSettings;
  seo: CmsSeo;
  heroSlides: CmsHeroSlide[];
  products: CmsProduct[];
  cars: CmsProduct[];
  serviceCars: CmsProduct[];
  bikes: CmsProduct[];
  faqs: CmsFaq[];
  testimonials: CmsTestimonial[];
  chargingStations: { district: string; stations: CmsChargingStation[] }[];
  totalStations: number;
};
