import "server-only";
import { createS3CompatAdapter, requireEnv } from "./_s3-common";
import type { StorageAdapter } from "./types";

/**
 * Backblaze B2 — free tier 10GB storage + 1GB/day download.
 * S3-compatible API → reuse _s3-common.
 *
 * Setup: https://www.backblaze.com/b2/docs/s3_compatible_api.html
 *
 * Env cần có khi STORAGE_PROVIDER=backblaze:
 *   B2_BUCKET, B2_ENDPOINT, B2_REGION, B2_ACCESS_KEY_ID,
 *   B2_SECRET_ACCESS_KEY, B2_PUBLIC_BASE_URL
 *
 * Endpoint format: https://s3.{region}.backblazeb2.com
 *   ví dụ us-west-002 -> https://s3.us-west-002.backblazeb2.com
 */
export function createBackblazeAdapter(): StorageAdapter {
  const bucket = requireEnv("B2_BUCKET");
  const region = requireEnv("B2_REGION");
  const endpoint = process.env.B2_ENDPOINT?.trim() || `https://s3.${region}.backblazeb2.com`;
  const publicBaseUrl =
    process.env.B2_PUBLIC_BASE_URL?.trim() || `${endpoint}/${bucket}`;

  return createS3CompatAdapter({
    provider: "backblaze",
    bucket,
    publicBaseUrl,
    endpoint,
    region,
    accessKeyId: requireEnv("B2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("B2_SECRET_ACCESS_KEY"),
  });
}
