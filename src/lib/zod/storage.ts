import { z } from "zod";

export const StorageResource = z.enum(["products", "hero", "seo", "misc"]);
export type StorageResourceT = z.infer<typeof StorageResource>;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"] as const;

export const StoragePresignInput = z.object({
  resource: StorageResource,
  slug: z.string().min(1).max(120).default("misc"),
  filename: z.string().min(1).max(200),
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_BYTES),
});
export type StoragePresignInputT = z.infer<typeof StoragePresignInput>;

export const StoragePresignResponse = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  key: z.string(),
  expiresIn: z.number().int().positive(),
});
export type StoragePresignResponseT = z.infer<typeof StoragePresignResponse>;
