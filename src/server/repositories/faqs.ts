import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const faqsRepo = {
  list(where: Prisma.FaqWhereInput = {}) {
    return prisma.faq.findMany({ where, orderBy: [{ sortOrder: "asc" }] });
  },
  listActive() {
    return this.list({ isActive: true });
  },
  getById(id: string) {
    return prisma.faq.findUnique({ where: { id } });
  },
  create(data: Prisma.FaqCreateInput) {
    return prisma.faq.create({ data });
  },
  update(id: string, data: Prisma.FaqUpdateInput) {
    return prisma.faq.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.faq.delete({ where: { id } });
  },
};
