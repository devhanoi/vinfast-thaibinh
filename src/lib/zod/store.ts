import { z } from "zod";

const Hours = z.object({
  days: z.array(z.string()).min(1),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
});

const Address = z.object({
  street: z.string().min(1).max(200),
  ward: z.string().max(120).optional(),
  city: z.string().min(1).max(120),
  region: z.string().min(1).max(120),
  postalCode: z.string().max(20).optional(),
  country: z.string().length(2).default("VN"),
});

const Social = z.object({
  facebook: z.string().url().optional(),
  zalo: z.string().url().optional(),
  youtube: z.string().url().optional(),
  tiktok: z.string().url().optional(),
});

const SalesRep = z.object({
  name: z.string().min(1).max(80),
  role: z.string().max(80).optional(),
  experience: z.string().max(200).optional(),
});

export const StoreSettingsEntity = z.object({
  name: z.string().min(1).max(120),
  legalName: z.string().max(200).optional(),
  url: z.string().url(),
  hotline: z.string().min(8).max(20),
  hotlineE164: z.string().regex(/^\+\d{6,15}$/),
  email: z.string().email(),
  address: Address,
  geo: z.object({ latitude: z.number(), longitude: z.number() }),
  hours: z.array(Hours).default([]),
  social: Social.default({}),
  areaServed: z.array(z.string()).default([]),
  salesRep: SalesRep,
});
export type StoreSettingsEntityT = z.infer<typeof StoreSettingsEntity>;

export const StoreSettingsUpdateInput = StoreSettingsEntity.partial();
export type StoreSettingsUpdateInputT = z.infer<typeof StoreSettingsUpdateInput>;
