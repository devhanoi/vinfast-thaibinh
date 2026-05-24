import { z } from "zod";
import { Id, IsActive, SortOrder } from "./common";

export const ChargingStationEntity = z.object({
  id: Id,
  name: z.string(),
  address: z.string(),
  district: z.string(),
  mapUrl: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});
export type ChargingStationEntityT = z.infer<typeof ChargingStationEntity>;

export const ChargingStationCreateInput = z.object({
  name: z.string().min(1).max(160),
  address: z.string().min(1).max(300),
  district: z.string().min(1).max(80),
  mapUrl: z.string().url().nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  isActive: IsActive.optional(),
  sortOrder: SortOrder.optional(),
});
export type ChargingStationCreateInputT = z.infer<typeof ChargingStationCreateInput>;

export const ChargingStationUpdateInput = ChargingStationCreateInput.partial();
export type ChargingStationUpdateInputT = z.infer<typeof ChargingStationUpdateInput>;
