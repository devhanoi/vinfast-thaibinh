import "server-only";
import { randomUUID } from "node:crypto";
import { getStorage } from "../storage";
import { ValidationError } from "../errors";
import {
  StoragePresignInput,
  type StoragePresignInputT,
  type StoragePresignResponseT,
} from "@/lib/zod";

const PRESIGN_TTL_SEC = 300;

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "misc";
}

function makeKey(resource: string, slug: string, ext: string): string {
  return `${resource}/${slugify(slug)}/${randomUUID()}.${ext}`;
}

export async function createPresignedUpload(
  input: StoragePresignInputT,
): Promise<StoragePresignResponseT> {
  const data = StoragePresignInput.parse(input);
  const ext = EXT_BY_CONTENT_TYPE[data.contentType];
  if (!ext) throw new ValidationError(`Content-Type không hỗ trợ: ${data.contentType}`);
  const key = makeKey(data.resource, data.slug, ext);
  const storage = getStorage();
  return storage.presignPut({ key, contentType: data.contentType, ttlSec: PRESIGN_TTL_SEC });
}

export async function deleteStorageObject(key: string): Promise<void> {
  const storage = getStorage();
  await storage.deleteObject(key);
}
