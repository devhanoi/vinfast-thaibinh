import { z } from "zod";
import { Id } from "./common";

export const LeadStatus = z.enum(["new", "contacted", "won", "lost"]);
export type LeadStatusT = z.infer<typeof LeadStatus>;

const PhoneVN = z.string().regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ");

export const LeadEntity = z.object({
  id: Id,
  name: z.string(),
  phone: z.string(),
  model: z.string(),
  address: z.string().nullable(),
  note: z.string().nullable(),
  status: LeadStatus,
  source: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type LeadEntityT = z.infer<typeof LeadEntity>;

export const LeadCreateInput = z.object({
  name: z.string().min(2).max(120),
  phone: PhoneVN,
  model: z.string().min(1).max(80),
  address: z.string().max(300).optional(),
  note: z.string().max(1000).optional(),
  source: z.string().max(40).default("website"),
  website: z.string().max(0).optional(),
});
export type LeadCreateInputT = z.infer<typeof LeadCreateInput>;

export const LeadStatusUpdateInput = z.object({
  status: LeadStatus,
});
export type LeadStatusUpdateInputT = z.infer<typeof LeadStatusUpdateInput>;

export const LeadListQuery = z.object({
  status: LeadStatus.optional(),
});
export type LeadListQueryT = z.infer<typeof LeadListQuery>;
