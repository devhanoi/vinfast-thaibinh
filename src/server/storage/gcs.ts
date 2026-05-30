import "server-only";
import type { StorageAdapter } from "./types";

/**
 * Google Cloud Storage — free tier 5GB Standard storage region us-central-1.
 *
 * **Chưa wire** vì cần install dep @google-cloud/storage (~25MB) — chưa muốn
 * cài mặc định. Khi cần dùng:
 *
 * 1. `pnpm add @google-cloud/storage`
 * 2. Uncomment phần implement bên dưới
 * 3. Thêm `registerStorage("gcs", createGcsAdapter)` vào storage/index.ts
 * 4. Env: GCS_BUCKET, GCS_PROJECT_ID, GCS_CLIENT_EMAIL, GCS_PRIVATE_KEY,
 *    GCS_PUBLIC_BASE_URL (optional, default public bucket URL)
 *
 * Reference: https://cloud.google.com/storage/docs/reference/libraries
 */
export function createGcsAdapter(): StorageAdapter {
  throw new Error(
    "GCS adapter chưa wire. Xem hướng dẫn trong src/server/storage/gcs.ts để bật.",
  );

  // ─── Phần implement (uncomment khi cài @google-cloud/storage) ──────────────
  // const { Storage } = require("@google-cloud/storage");
  // const projectId = requireEnv("GCS_PROJECT_ID");
  // const bucketName = requireEnv("GCS_BUCKET");
  // const publicBase =
  //   process.env.GCS_PUBLIC_BASE_URL?.trim() ||
  //   `https://storage.googleapis.com/${bucketName}`;
  //
  // const client = new Storage({
  //   projectId,
  //   credentials: {
  //     client_email: requireEnv("GCS_CLIENT_EMAIL"),
  //     private_key: requireEnv("GCS_PRIVATE_KEY").replace(/\\n/g, "\n"),
  //   },
  // });
  // const bucket = client.bucket(bucketName);
  //
  // return {
  //   provider: "gcs",
  //   async presignPut({ key, contentType, ttlSec = 300 }) {
  //     const [url] = await bucket.file(key).getSignedUrl({
  //       version: "v4",
  //       action: "write",
  //       expires: Date.now() + ttlSec * 1000,
  //       contentType,
  //     });
  //     return { uploadUrl: url, publicUrl: `${publicBase}/${key}`, key, expiresIn: ttlSec };
  //   },
  //   async presignGet(key, ttlSec = 300) {
  //     const [url] = await bucket.file(key).getSignedUrl({
  //       version: "v4",
  //       action: "read",
  //       expires: Date.now() + ttlSec * 1000,
  //     });
  //     return url;
  //   },
  //   async putObject({ key, body, contentType }) {
  //     await bucket.file(key).save(Buffer.from(body), { contentType });
  //     return { key, publicUrl: `${publicBase}/${key}` };
  //   },
  //   async deleteObject(key) {
  //     await bucket.file(key).delete({ ignoreNotFound: true });
  //   },
  //   getPublicUrl(key) {
  //     return `${publicBase}/${key}`;
  //   },
  // };
}
