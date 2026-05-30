import { z } from "zod";

export const Id = z.string().min(1);
export const Slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug phải dạng kebab-case");

/**
 * URL tuyệt đối (https://...) hoặc đường dẫn tương đối (/images/...).
 * Dùng cho image src lưu trong DB (vừa có thể là R2/S3 public URL, vừa có thể
 * là relative path tới `public/`).
 */
export const ImageSrc = z
  .string()
  .min(1)
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Phải là URL hoặc đường dẫn bắt đầu bằng /",
  });

export const PublishStatus = z.enum(["draft", "active", "archived"]);
export type PublishStatusT = z.infer<typeof PublishStatus>;

export const SortOrder = z.number().int().min(0).max(9999).default(0);
export const IsActive = z.boolean().default(true);

export const ListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(50).optional(),
  q: z.string().trim().min(1).optional(),
});

export const ListResult = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
  });
