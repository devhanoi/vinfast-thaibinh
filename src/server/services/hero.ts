import "server-only";
import type { HeroSlide } from "@prisma/client";
import { heroRepo } from "../repositories/hero";
import { NotFoundError } from "../errors";
import {
  HeroSlideCreateInput,
  HeroSlideUpdateInput,
  type HeroSlideCreateInputT,
  type HeroSlideEntityT,
  type HeroSlideUpdateInputT,
} from "@/lib/zod";

function mapSlide(row: HeroSlide): HeroSlideEntityT {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function listHeroSlides(includeInactive = false): Promise<HeroSlideEntityT[]> {
  const rows = includeInactive ? await heroRepo.list() : await heroRepo.listActive();
  return rows.map(mapSlide);
}

export async function getHeroSlide(id: string): Promise<HeroSlideEntityT> {
  const row = await heroRepo.getById(id);
  if (!row) throw new NotFoundError("Hero slide", id);
  return mapSlide(row);
}

export async function createHeroSlide(input: HeroSlideCreateInputT): Promise<HeroSlideEntityT> {
  const data = HeroSlideCreateInput.parse(input);
  const row = await heroRepo.create({
    title: data.title,
    subtitle: data.subtitle,
    imageUrl: data.imageUrl,
    imageAlt: data.imageAlt,
    ctaLabel: data.ctaLabel,
    ctaHref: data.ctaHref,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
  return mapSlide(row);
}

export async function updateHeroSlide(id: string, input: HeroSlideUpdateInputT): Promise<HeroSlideEntityT> {
  const data = HeroSlideUpdateInput.parse(input);
  await getHeroSlide(id);
  const row = await heroRepo.update(id, data);
  return mapSlide(row);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  await getHeroSlide(id);
  await heroRepo.delete(id);
}
