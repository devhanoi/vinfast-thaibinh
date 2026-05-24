import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const chargingRepo = {
  list(where: Prisma.ChargingStationWhereInput = {}) {
    return prisma.chargingStation.findMany({
      where,
      orderBy: [{ district: "asc" }, { sortOrder: "asc" }],
    });
  },
  listActive() {
    return this.list({ isActive: true });
  },
  getById(id: string) {
    return prisma.chargingStation.findUnique({ where: { id } });
  },
  create(data: Prisma.ChargingStationCreateInput) {
    return prisma.chargingStation.create({ data });
  },
  update(id: string, data: Prisma.ChargingStationUpdateInput) {
    return prisma.chargingStation.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.chargingStation.delete({ where: { id } });
  },
};
