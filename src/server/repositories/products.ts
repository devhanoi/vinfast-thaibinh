import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

const includeImages = {
  images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] },
};

export const productsRepo = {
  list(where: Prisma.ProductWhereInput = {}) {
    return prisma.product.findMany({
      where,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      include: includeImages,
    });
  },
  getById(id: string) {
    return prisma.product.findUnique({ where: { id }, include: includeImages });
  },
  getBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, include: includeImages });
  },
  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data, include: includeImages });
  },
  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data, include: includeImages });
  },
  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};

export const productImagesRepo = {
  list(productId: string) {
    return prisma.productImage.findMany({
      where: { productId },
      orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
    });
  },
  create(data: Prisma.ProductImageUncheckedCreateInput) {
    return prisma.productImage.create({ data });
  },
  update(id: string, data: Prisma.ProductImageUpdateInput) {
    return prisma.productImage.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.productImage.delete({ where: { id } });
  },
  unsetPrimary(productId: string) {
    return prisma.productImage.updateMany({ where: { productId, isPrimary: true }, data: { isPrimary: false } });
  },
};

export type ProductWithImages = Prisma.PromiseReturnType<typeof productsRepo.getById>;
