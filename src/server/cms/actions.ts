"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { loginAdmin, logoutAdmin, requireAdmin } from "@/server/auth/session";

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  category: z.enum(["car", "service_car", "bike"]),
  segment: z.string().optional(),
  tagline: z.string().optional(),
  priceFrom: z.coerce.number().int().nonnegative(),
  battery: z.string().optional(),
  rangeKm: z.coerce.number().int().nonnegative().optional(),
  rangeText: z.string().optional(),
  highlights: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
  sortOrder: z.coerce.number().int().default(0),
});

function refreshPublic() {
  revalidateTag("cms");
  revalidatePath("/");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const ok = await loginAdmin(email, password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData));
  const highlights = parsed.highlights
    ? parsed.highlights.split("\n").map((item) => item.trim()).filter(Boolean)
    : [];

  const data = {
    slug: parsed.slug,
    name: parsed.name,
    category: parsed.category,
    segment: parsed.segment || null,
    tagline: parsed.tagline || null,
    priceFrom: parsed.priceFrom,
    battery: parsed.battery || null,
    rangeKm: parsed.rangeKm || null,
    rangeText: parsed.rangeText || null,
    highlightsJson: highlights,
    status: parsed.status,
    sortOrder: parsed.sortOrder,
  };

  if (parsed.id) {
    await prisma.product.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.product.create({ data });
  }
  refreshPublic();
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.product.delete({ where: { id } });
  refreshPublic();
}

export async function saveProductImageAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  if (!productId || !url) return;
  await prisma.productImage.create({
    data: {
      productId,
      url,
      key: String(formData.get("key") ?? url),
      alt: String(formData.get("alt") ?? "Ảnh xe VinFast Thái Bình"),
      color: String(formData.get("color") ?? "") || null,
      angle: String(formData.get("angle") ?? "") || null,
      isPrimary: formData.get("isPrimary") === "on",
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  refreshPublic();
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteProductImageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (id) await prisma.productImage.delete({ where: { id } });
  refreshPublic();
  if (productId) revalidatePath(`/admin/products/${productId}`);
}

export async function saveHeroSlideAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    ctaLabel: String(formData.get("ctaLabel") ?? "Nhận báo giá"),
    ctaHref: String(formData.get("ctaHref") ?? "#bao-gia"),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (id) await prisma.heroSlide.update({ where: { id }, data });
  else await prisma.heroSlide.create({ data });
  refreshPublic();
  redirect("/admin/hero");
}

export async function updateStoreSettingsAction(formData: FormData) {
  await requireAdmin();
  const valueJson = JSON.parse(String(formData.get("valueJson") ?? "{}"));
  await prisma.storeSetting.upsert({
    where: { key: "site" },
    update: { valueJson },
    create: { key: "site", valueJson },
  });
  refreshPublic();
  redirect("/admin/store");
}

export async function saveSeoAction(formData: FormData) {
  await requireAdmin();
  const pageKey = String(formData.get("pageKey") ?? "home");
  await prisma.seoSetting.upsert({
    where: { pageKey },
    update: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      ogImageUrl: String(formData.get("ogImageUrl") ?? "") || null,
      canonicalPath: String(formData.get("canonicalPath") ?? "/"),
    },
    create: {
      pageKey,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      ogImageUrl: String(formData.get("ogImageUrl") ?? "") || null,
      canonicalPath: String(formData.get("canonicalPath") ?? "/"),
    },
  });
  refreshPublic();
  redirect("/admin/seo");
}

export async function saveFaqAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  refreshPublic();
  redirect("/admin/content");
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();
  await prisma.lead.update({
    where: { id: String(formData.get("id") ?? "") },
    data: { status: String(formData.get("status") ?? "new") as "new" | "contacted" | "won" | "lost" },
  });
  revalidatePath("/admin/leads");
}
