import "server-only";
import { createS3CompatAdapter, requireEnv } from "./_s3-common";
import type { StorageAdapter } from "./types";

/**
 * Supabase Storage — free tier 1GB (free plan).
 * S3-compatible từ 2024 (beta) — reuse _s3-common.
 *
 * Setup: https://supabase.com/docs/guides/storage/s3/authentication
 *
 * Env cần có khi STORAGE_PROVIDER=supabase:
 *   SUPABASE_PROJECT_REF  ví dụ: abc123xyz
 *   SUPABASE_BUCKET       tên bucket
 *   SUPABASE_REGION       region của project, ví dụ ap-southeast-1
 *   SUPABASE_ACCESS_KEY_ID, SUPABASE_SECRET_ACCESS_KEY
 *
 * Endpoint tự build: https://{projectRef}.supabase.co/storage/v1/s3
 * Public URL: https://{projectRef}.supabase.co/storage/v1/object/public/{bucket}/{key}
 */
export function createSupabaseAdapter(): StorageAdapter {
  const projectRef = requireEnv("SUPABASE_PROJECT_REF");
  const bucket = requireEnv("SUPABASE_BUCKET");
  const region = process.env.SUPABASE_REGION?.trim() || "us-east-1";

  return createS3CompatAdapter({
    provider: "supabase",
    bucket,
    publicBaseUrl: `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}`,
    endpoint: `https://${projectRef}.supabase.co/storage/v1/s3`,
    region,
    accessKeyId: requireEnv("SUPABASE_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("SUPABASE_SECRET_ACCESS_KEY"),
    forcePathStyle: true,
  });
}
