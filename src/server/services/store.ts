import "server-only";
import { Prisma } from "@prisma/client";
import { storeRepo } from "../repositories/store";
import { SITE } from "@/lib/site";
import {
  StoreSettingsEntity,
  StoreSettingsUpdateInput,
  type StoreSettingsEntityT,
  type StoreSettingsUpdateInputT,
} from "@/lib/zod";

function mergeWithDefaults(partial: Partial<StoreSettingsEntityT> | null): StoreSettingsEntityT {
  return StoreSettingsEntity.parse({ ...SITE, ...(partial ?? {}) });
}

export async function getStoreSettings(): Promise<StoreSettingsEntityT> {
  const row = await storeRepo.getSite();
  if (!row) return mergeWithDefaults(null);
  return mergeWithDefaults(row.valueJson as Partial<StoreSettingsEntityT>);
}

export async function updateStoreSettings(input: StoreSettingsUpdateInputT): Promise<StoreSettingsEntityT> {
  const data = StoreSettingsUpdateInput.parse(input);
  const current = await getStoreSettings();
  const merged = mergeWithDefaults({ ...current, ...data });
  await storeRepo.upsertSite(merged as unknown as Prisma.InputJsonValue);
  return merged;
}
