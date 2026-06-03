import "server-only";
import { Prisma } from "@prisma/client";
import { productImagesRepo, productsRepo, type ProductWithImages } from "../repositories/products";
import { NotFoundError, ConflictError } from "../errors";
import { toRecord, toStringArray } from "./_mapping";
import {
  ProductCreateInput,
  ProductUpdateInput,
  ProductImageCreateInput,
  ProductImageUpdateInput,
  type ProductCreateInputT,
  type ProductEntityT,
  type ProductImageCreateInputT,
  type ProductImageEntityT,
  type ProductImageUpdateInputT,
  type ProductListQueryT,
  type ProductUpdateInputT,
} from "@/lib/zod";

function mapImage(row: NonNullable<ProductWithImages>["images"][number]): ProductImageEntityT {
  return {
    id: row.id,
    url: row.url,
    key: row.key,
    alt: row.alt,
    color: row.color,
    angle: row.angle,
    isPrimary: row.isPrimary,
    sortOrder: row.sortOrder,
  };
}

function mapProduct(row: NonNullable<ProductWithImages>): ProductEntityT {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    segment: row.segment,
    tagline: row.tagline,
    description: row.description,
    priceFrom: row.priceFrom,
    battery: row.battery,
    rangeKm: row.rangeKm,
    rangeText: row.rangeText,
    specs: toRecord(row.specsJson),
    highlights: toStringArray(row.highlightsJson),
    status: row.status,
    sortOrder: row.sortOrder,
    images: row.images.map(mapImage),
  };
}

export async function listProducts(query: ProductListQueryT = {}): Promise<ProductEntityT[]> {
  const where: Prisma.ProductWhereInput = {};
  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.active && !query.status) where.status = "active";
  const rows = await productsRepo.list(where);
  return rows.map(mapProduct);
}

export async function getProductById(id: string): Promise<ProductEntityT> {
  const row = await productsRepo.getById(id);
  if (!row) throw new NotFoundError("Sản phẩm", id);
  return mapProduct(row);
}

export async function getProductBySlug(slug: string): Promise<ProductEntityT | null> {
  const row = await productsRepo.getBySlug(slug);
  return row ? mapProduct(row) : null;
}

export async function createProduct(input: ProductCreateInputT): Promise<ProductEntityT> {
  const data = ProductCreateInput.parse(input);
  try {
    const row = await productsRepo.create({
      slug: data.slug,
      name: data.name,
      category: data.category,
      segment: data.segment ?? null,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      priceFrom: data.priceFrom,
      battery: data.battery ?? null,
      rangeKm: data.rangeKm ?? null,
      rangeText: data.rangeText ?? null,
      specsJson: data.specs as Prisma.InputJsonValue,
      highlightsJson: data.highlights as Prisma.InputJsonValue,
      status: data.status,
      sortOrder: data.sortOrder ?? 0,
    });
    return mapProduct(row);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError(`Slug "${data.slug}" đã tồn tại`);
    }
    throw err;
  }
}

export async function updateProduct(id: string, input: ProductUpdateInputT): Promise<ProductEntityT> {
  const data = ProductUpdateInput.parse(input);
  await getProductById(id);
  const update: Prisma.ProductUpdateInput = {};
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.name !== undefined) update.name = data.name;
  if (data.category !== undefined) update.category = data.category;
  if (data.segment !== undefined) update.segment = data.segment;
  if (data.tagline !== undefined) update.tagline = data.tagline;
  if (data.description !== undefined) update.description = data.description;
  if (data.priceFrom !== undefined) update.priceFrom = data.priceFrom;
  if (data.battery !== undefined) update.battery = data.battery;
  if (data.rangeKm !== undefined) update.rangeKm = data.rangeKm;
  if (data.rangeText !== undefined) update.rangeText = data.rangeText;
  if (data.specs !== undefined) update.specsJson = data.specs as Prisma.InputJsonValue;
  if (data.highlights !== undefined) update.highlightsJson = data.highlights as Prisma.InputJsonValue;
  if (data.status !== undefined) update.status = data.status;
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;
  try {
    const row = await productsRepo.update(id, update);
    return mapProduct(row);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError(`Slug "${data.slug}" đã tồn tại`);
    }
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await getProductById(id);
  await productsRepo.delete(id);
}

export async function attachProductImage(productId: string, input: ProductImageCreateInputT): Promise<ProductImageEntityT> {
  const data = ProductImageCreateInput.parse(input);
  await getProductById(productId);
  if (data.isPrimary) await productImagesRepo.unsetPrimary(productId);
  const row = await productImagesRepo.create({
    productId,
    url: data.url,
    key: data.key ?? null,
    alt: data.alt,
    color: data.color ?? null,
    angle: data.angle ?? null,
    isPrimary: data.isPrimary ?? false,
    sortOrder: data.sortOrder ?? 0,
  });
  return mapImage(row);
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  input: ProductImageUpdateInputT,
): Promise<ProductImageEntityT> {
  const data = ProductImageUpdateInput.parse(input);
  if (data.isPrimary === true) await productImagesRepo.unsetPrimary(productId);
  const row = await productImagesRepo.update(imageId, {
    url: data.url,
    key: data.key,
    alt: data.alt,
    color: data.color,
    angle: data.angle,
    isPrimary: data.isPrimary,
    sortOrder: data.sortOrder,
  });
  return mapImage(row);
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await productImagesRepo.delete(imageId);
}
