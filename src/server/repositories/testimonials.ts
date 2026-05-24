import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const testimonialsRepo = {
  list(where: Prisma.TestimonialWhereInput = {}) {
    return prisma.testimonial.findMany({ where, orderBy: [{ sortOrder: "asc" }] });
  },
  listActive() {
    return this.list({ isActive: true });
  },
  getById(id: string) {
    return prisma.testimonial.findUnique({ where: { id } });
  },
  create(data: Prisma.TestimonialCreateInput) {
    return prisma.testimonial.create({ data });
  },
  update(id: string, data: Prisma.TestimonialUpdateInput) {
    return prisma.testimonial.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  },
};
