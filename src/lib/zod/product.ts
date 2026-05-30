import { z } from "zod";
import { Id, IsActive, ImageSrc, PublishStatus, Slug, SortOrder } from "./common";

export const ProductCategory = z.enum(["car", "service_car", "bike"]);
export type ProductCategoryT = z.infer<typeof ProductCategory>;

export const ProductImageEntity = z.object({
  id: Id,
  url: ImageSrc,
  key: z.string().nullable(),
  alt: z.string(),
  color: z.string().nullable(),
  angle: z.string().nullable(),
  isPrimary: z.boolean(),
  sortOrder: z.number().int(),
});
export type ProductImageEntityT = z.infer<typeof ProductImageEntity>;

export const ProductEntity = z.object({
  id: Id,
  slug: Slug,
  name: z.string(),
  category: ProductCategory,
  segment: z.string().nullable(),
  tagline: z.string().nullable(),
  priceFrom: z.number().int().nonnegative(),
  battery: z.string().nullable(),
  rangeKm: z.number().int().nullable(),
  rangeText: z.string().nullable(),
  specs: z.record(z.string(), z.unknown()),
  highlights: z.array(z.string()),
  status: PublishStatus,
  sortOrder: z.number().int(),
  images: z.array(ProductImageEntity),
});
export type ProductEntityT = z.infer<typeof ProductEntity>;

export const ProductCreateInput = z.object({
  slug: Slug,
  name: z.string().min(1).max(120),
  category: ProductCategory.default("car"),
  segment: z.string().max(80).nullable().optional(),
  tagline: z.string().max(200).nullable().optional(),
  priceFrom: z.number().int().nonnegative(),
  battery: z.string().max(40).nullable().optional(),
  rangeKm: z.number().int().nonnegative().nullable().optional(),
  rangeText: z.string().max(60).nullable().optional(),
  specs: z.record(z.string(), z.unknown()).default({}),
  highlights: z.array(z.string().min(1).max(120)).default([]),
  status: PublishStatus.default("active"),
  sortOrder: SortOrder.optional(),
});
export type ProductCreateInputT = z.infer<typeof ProductCreateInput>;

export const ProductUpdateInput = ProductCreateInput.partial();
export type ProductUpdateInputT = z.infer<typeof ProductUpdateInput>;

export const ProductListQuery = z.object({
  category: ProductCategory.optional(),
  status: PublishStatus.optional(),
  active: z.coerce.boolean().optional(),
});
export type ProductListQueryT = z.infer<typeof ProductListQuery>;

export const ProductImageCreateInput = z.object({
  url: ImageSrc,
  key: z.string().nullable().optional(),
  alt: z.string().min(1).max(200),
  color: z.string().max(40).nullable().optional(),
  angle: z.string().max(40).nullable().optional(),
  isPrimary: IsActive.optional(),
  sortOrder: SortOrder.optional(),
});
export type ProductImageCreateInputT = z.infer<typeof ProductImageCreateInput>;

export const ProductImageUpdateInput = ProductImageCreateInput.partial();
export type ProductImageUpdateInputT = z.infer<typeof ProductImageUpdateInput>;
