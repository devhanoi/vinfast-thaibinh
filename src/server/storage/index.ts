import "server-only";
import { registerStorage, getStorage, listProviders } from "./registry";
import { createLocalAdapter } from "./local";
import { createR2Adapter } from "./r2";
import { createS3Adapter } from "./s3";
import { createBackblazeAdapter } from "./backblaze";
import { createSupabaseAdapter } from "./supabase";

// ─── Built-in providers ─────────────────────────────────────────────────────
// Để switch provider: đổi STORAGE_PROVIDER trong .env. Không cần sửa code.
//
// Thêm provider mới (vd. cloudinary, uploadthing, firebase):
//   1. Tạo src/server/storage/{name}.ts implement StorageAdapter interface
//   2. registerStorage("{name}", create{Name}Adapter) ở dưới
//   3. Doc env vars trong docs/STORAGE-PROVIDERS.md
// ────────────────────────────────────────────────────────────────────────────
registerStorage("local", createLocalAdapter);
registerStorage("r2", createR2Adapter);
registerStorage("s3", createS3Adapter);
registerStorage("backblaze", createBackblazeAdapter);
registerStorage("supabase", createSupabaseAdapter);

// GCS chưa wire vì cần dep nặng @google-cloud/storage. Xem gcs.ts cho hướng dẫn:
// import { createGcsAdapter } from "./gcs";
// registerStorage("gcs", createGcsAdapter);

export { getStorage, registerStorage, listProviders };
export type { StorageAdapter, StorageProvider } from "./types";
