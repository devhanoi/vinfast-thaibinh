import { z } from "zod";
import { Id, IsActive, SortOrder } from "./common";

export const TestimonialEntity = z.object({
  id: Id,
  name: z.string(),
  content: z.string(),
  rating: z.number().int().min(1).max(5),
  location: z.string().nullable(),
  vehicle: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});
export type TestimonialEntityT = z.infer<typeof TestimonialEntity>;

export const TestimonialCreateInput = z.object({
  name: z.string().min(1).max(120),
  content: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  location: z.string().max(120).nullable().optional(),
  vehicle: z.string().max(120).nullable().optional(),
  isActive: IsActive.optional(),
  sortOrder: SortOrder.optional(),
});
export type TestimonialCreateInputT = z.infer<typeof TestimonialCreateInput>;

export const TestimonialUpdateInput = TestimonialCreateInput.partial();
export type TestimonialUpdateInputT = z.infer<typeof TestimonialUpdateInput>;
