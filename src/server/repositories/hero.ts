import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const heroRepo = {
  list(where: Prisma.HeroSlideWhereInput = {}) {
    return prisma.heroSlide.findMany({ where, orderBy: [{ sortOrder: "asc" }] });
  },
  listActive() {
    return this.list({ isActive: true });
  },
  getById(id: string) {
    return prisma.heroSlide.findUnique({ where: { id } });
  },
  create(data: Prisma.HeroSlideCreateInput) {
    return prisma.heroSlide.create({ data });
  },
  update(id: string, data: Prisma.HeroSlideUpdateInput) {
    return prisma.heroSlide.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.heroSlide.delete({ where: { id } });
  },
};
