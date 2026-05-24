import "server-only";
import { createS3CompatAdapter, requireEnv } from "./_s3-common";
import type { StorageAdapter } from "./types";

export function createS3Adapter(): StorageAdapter {
  const bucket = requireEnv("S3_BUCKET");
  const region = requireEnv("S3_REGION");
  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL?.trim() || `https://${bucket}.s3.${region}.amazonaws.com`;

  return createS3CompatAdapter({
    provider: "s3",
    bucket,
    publicBaseUrl,
    region,
    accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
  });
}
