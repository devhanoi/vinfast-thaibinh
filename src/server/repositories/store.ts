import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

const KEY = "site";

export const storeRepo = {
  getSite() {
    return prisma.storeSetting.findUnique({ where: { key: KEY } });
  },
  upsertSite(valueJson: Prisma.InputJsonValue) {
    return prisma.storeSetting.upsert({
      where: { key: KEY },
      create: { key: KEY, valueJson },
      update: { valueJson },
    });
  },
};
