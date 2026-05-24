import "server-only";
import { getHomePageData as homeData } from "../services/home";
import { listProducts, getProductBySlug as svcGetBySlug } from "../services/products";
import { getStoreSettings as svcGetStore } from "../services/store";
import { getSeo } from "../services/seo";
import type { CmsProduct, SiteSettings } from "./types";
import type { ProductEntityT, ProductImageEntityT } from "@/lib/zod";

function toCmsProduct(p: ProductEntityT): CmsProduct {
  const primary = p.images.find((img: ProductImageEntityT) => img.isPrimary) ?? p.images[0];
  return {
    ...p,
    image: primary?.url ?? "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
    imageAlt: primary?.alt ?? `${p.name} tại VinFast Thái Bình`,
  };
}

export const getHomePageData = homeData;

export async function getProducts(filters: { status?: "active" | "draft" | "archived"; category?: CmsProduct["category"] } = {}) {
  const items = await listProducts(filters);
  return items.map(toCmsProduct);
}

export async function getProductBySlug(slug: string): Promise<CmsProduct | null> {
  const p = await svcGetBySlug(slug);
  return p ? toCmsProduct(p) : null;
}

export async function getStoreSettings(): Promise<SiteSettings> {
  return (await svcGetStore()) as unknown as SiteSettings;
}

export async function getSeoSettings(pageKey: string) {
  return getSeo(pageKey);
}
