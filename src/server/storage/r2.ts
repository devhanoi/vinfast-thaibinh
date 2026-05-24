import "server-only";
import { createS3CompatAdapter, requireEnv } from "./_s3-common";
import type { StorageAdapter } from "./types";

export function createR2Adapter(): StorageAdapter {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return createS3CompatAdapter({
    provider: "r2",
    bucket: requireEnv("R2_BUCKET"),
    publicBaseUrl: requireEnv("R2_PUBLIC_BASE_URL"),
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  });
}
