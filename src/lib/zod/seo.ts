import { z } from "zod";
import { ImageSrc } from "./common";

export const SeoPageKey = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9_-]+$/, "pageKey phải kebab-case hoặc snake_case");

export const SeoEntity = z.object({
  pageKey: SeoPageKey,
  title: z.string(),
  description: z.string(),
  ogImageUrl: z.string().nullable(),
  canonicalPath: z.string(),
});
export type SeoEntityT = z.infer<typeof SeoEntity>;

export const SeoUpsertInput = z.object({
  pageKey: SeoPageKey,
  title: z.string().min(1).max(70),
  description: z.string().min(1).max(180),
  ogImageUrl: ImageSrc.nullable().optional(),
  canonicalPath: z.string().min(1).max(200).default("/"),
});
export type SeoUpsertInputT = z.infer<typeof SeoUpsertInput>;
