import "server-only";
import type { ChargingStation, Prisma } from "@prisma/client";
import { chargingRepo } from "../repositories/charging";
import { NotFoundError } from "../errors";
import { decimalToNumber } from "./_mapping";
import {
  ChargingStationCreateInput,
  ChargingStationUpdateInput,
  type ChargingStationCreateInputT,
  type ChargingStationEntityT,
  type ChargingStationUpdateInputT,
} from "@/lib/zod";

function mapStation(row: ChargingStation): ChargingStationEntityT {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    district: row.district,
    mapUrl: row.mapUrl,
    lat: decimalToNumber(row.lat),
    lng: decimalToNumber(row.lng),
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function listChargingStations(includeInactive = false): Promise<ChargingStationEntityT[]> {
  const rows = includeInactive ? await chargingRepo.list() : await chargingRepo.listActive();
  return rows.map(mapStation);
}

export async function listChargingByDistrict(): Promise<{ district: string; stations: ChargingStationEntityT[] }[]> {
  const stations = await listChargingStations(false);
  const map = new Map<string, ChargingStationEntityT[]>();
  for (const station of stations) {
    const items = map.get(station.district) ?? [];
    items.push(station);
    map.set(station.district, items);
  }
  return Array.from(map, ([district, items]) => ({ district, stations: items }));
}

export async function getChargingStation(id: string): Promise<ChargingStationEntityT> {
  const row = await chargingRepo.getById(id);
  if (!row) throw new NotFoundError("Trạm sạc", id);
  return mapStation(row);
}

export async function createChargingStation(input: ChargingStationCreateInputT): Promise<ChargingStationEntityT> {
  const data = ChargingStationCreateInput.parse(input);
  const row = await chargingRepo.create({
    name: data.name,
    address: data.address,
    district: data.district,
    mapUrl: data.mapUrl ?? null,
    lat: data.lat !== undefined && data.lat !== null ? (data.lat as unknown as Prisma.Decimal) : null,
    lng: data.lng !== undefined && data.lng !== null ? (data.lng as unknown as Prisma.Decimal) : null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
  return mapStation(row);
}

export async function updateChargingStation(id: string, input: ChargingStationUpdateInputT): Promise<ChargingStationEntityT> {
  const data = ChargingStationUpdateInput.parse(input);
  await getChargingStation(id);
  const update: Prisma.ChargingStationUpdateInput = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.address !== undefined) update.address = data.address;
  if (data.district !== undefined) update.district = data.district;
  if (data.mapUrl !== undefined) update.mapUrl = data.mapUrl;
  if (data.lat !== undefined) update.lat = data.lat as unknown as Prisma.Decimal;
  if (data.lng !== undefined) update.lng = data.lng as unknown as Prisma.Decimal;
  if (data.isActive !== undefined) update.isActive = data.isActive;
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;
  const row = await chargingRepo.update(id, update);
  return mapStation(row);
}

export async function deleteChargingStation(id: string): Promise<void> {
  await getChargingStation(id);
  await chargingRepo.delete(id);
}
