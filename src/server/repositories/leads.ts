import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const leadsRepo = {
  list(where: Prisma.LeadWhereInput = {}) {
    return prisma.lead.findMany({ where, orderBy: [{ createdAt: "desc" }] });
  },
  getById(id: string) {
    return prisma.lead.findUnique({ where: { id } });
  },
  create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({ data });
  },
  updateStatus(id: string, status: Prisma.LeadUpdateInput["status"]) {
    return prisma.lead.update({ where: { id }, data: { status } });
  },
};
