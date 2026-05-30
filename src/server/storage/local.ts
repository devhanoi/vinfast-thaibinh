import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { StorageAdapter } from "./types";

/**
 * Local filesystem adapter — lưu file vào `public/uploads/{key}`, URL trả về là
 * `/uploads/{key}` (Next.js phục vụ tĩnh từ thư mục public).
 *
 * Dùng cho development khi chưa có R2/S3. Production nên dùng R2 hoặc S3.
 *
 * Limitation: serverless deploy (Vercel) read-only filesystem -> chỉ chạy được
 * trên VPS/self-hosted hoặc local dev. Set STORAGE_PROVIDER=r2 khi deploy.
 */
export function createLocalAdapter(): StorageAdapter {
  const baseDir = join(process.cwd(), "public", "uploads");

  return {
    provider: "local",

    async presignPut() {
      throw new Error(
        "LocalAdapter không hỗ trợ presigned URL. Dùng POST /api/admin/storage/upload (proxy).",
      );
    },

    async presignGet(key) {
      return `/uploads/${key}`;
    },

    async putObject({ key, body }) {
      const filePath = join(baseDir, key);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, body);
      return { key, publicUrl: `/uploads/${key}` };
    },

    async deleteObject(key) {
      try {
        await unlink(join(baseDir, key));
      } catch {
        // Best effort — bỏ qua nếu file không tồn tại
      }
    },

    getPublicUrl(key) {
      return `/uploads/${key}`;
    },
  };
}
