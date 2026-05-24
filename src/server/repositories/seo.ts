import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export const seoRepo = {
  list() {
    return prisma.seoSetting.findMany({ orderBy: { pageKey: "asc" } });
  },
  getByPageKey(pageKey: string) {
    return prisma.seoSetting.findUnique({ where: { pageKey } });
  },
  upsert(pageKey: string, data: Omit<Prisma.SeoSettingCreateInput, "pageKey">) {
    return prisma.seoSetting.upsert({
      where: { pageKey },
      create: { pageKey, ...data },
      update: data,
    });
  },
  delete(pageKey: string) {
    return prisma.seoSetting.delete({ where: { pageKey } });
  },
};
