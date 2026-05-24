import { z } from "zod";
import { Id, IsActive, SortOrder } from "./common";

export const FaqEntity = z.object({
  id: Id,
  question: z.string(),
  answer: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});
export type FaqEntityT = z.infer<typeof FaqEntity>;

export const FaqCreateInput = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
  isActive: IsActive.optional(),
  sortOrder: SortOrder.optional(),
});
export type FaqCreateInputT = z.infer<typeof FaqCreateInput>;

export const FaqUpdateInput = FaqCreateInput.partial();
export type FaqUpdateInputT = z.infer<typeof FaqUpdateInput>;
