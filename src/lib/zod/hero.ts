import { z } from "zod";
import { Id, ImageSrc, IsActive, SortOrder } from "./common";

export const HeroSlideEntity = z.object({
  id: Id,
  title: z.string(),
  subtitle: z.string(),
  imageUrl: ImageSrc,
  imageAlt: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});
export type HeroSlideEntityT = z.infer<typeof HeroSlideEntity>;

export const HeroSlideCreateInput = z.object({
  title: z.string().min(1).max(120),
  subtitle: z.string().max(200).default(""),
  imageUrl: ImageSrc,
  imageAlt: z.string().min(1).max(200),
  ctaLabel: z.string().max(60).default("Xem thêm"),
  ctaHref: z.string().max(200).default("#"),
  isActive: IsActive.optional(),
  sortOrder: SortOrder.optional(),
});
export type HeroSlideCreateInputT = z.infer<typeof HeroSlideCreateInput>;

export const HeroSlideUpdateInput = HeroSlideCreateInput.partial();
export type HeroSlideUpdateInputT = z.infer<typeof HeroSlideUpdateInput>;
