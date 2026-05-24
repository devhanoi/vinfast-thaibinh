import { z } from "zod";

export const Id = z.string().min(1);
export const Slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug phải dạng kebab-case");

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
