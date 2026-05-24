import "server-only";
import type { SeoSetting } from "@prisma/client";
import { seoRepo } from "../repositories/seo";
import { NotFoundError } from "../errors";
import { SeoUpsertInput, type SeoEntityT, type SeoUpsertInputT } from "@/lib/zod";

function mapSeo(row: SeoSetting): SeoEntityT {
  return {
    pageKey: row.pageKey,
    title: row.title,
    description: row.description,
    ogImageUrl: row.ogImageUrl,
    canonicalPath: row.canonicalPath,
  };
}

export async function listSeo(): Promise<SeoEntityT[]> {
  const rows = await seoRepo.list();
  return rows.map(mapSeo);
}

export async function getSeo(pageKey: string): Promise<SeoEntityT | null> {
  const row = await seoRepo.getByPageKey(pageKey);
  return row ? mapSeo(row) : null;
}

export async function requireSeo(pageKey: string): Promise<SeoEntityT> {
  const seo = await getSeo(pageKey);
  if (!seo) throw new NotFoundError("SEO", pageKey);
  return seo;
}

export async function upsertSeo(input: SeoUpsertInputT): Promise<SeoEntityT> {
  const data = SeoUpsertInput.parse(input);
  const row = await seoRepo.upsert(data.pageKey, {
    title: data.title,
    description: data.description,
    ogImageUrl: data.ogImageUrl ?? null,
    canonicalPath: data.canonicalPath,
  });
  return mapSeo(row);
}

export async function deleteSeo(pageKey: string): Promise<void> {
  await requireSeo(pageKey);
  await seoRepo.delete(pageKey);
}
