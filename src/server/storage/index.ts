import "server-only";
import { createR2Adapter } from "./r2";
import { createS3Adapter } from "./s3";
import type { StorageAdapter, StorageProvider } from "./types";

let _adapter: StorageAdapter | null = null;

function pickProvider(): StorageProvider {
  const raw = (process.env.STORAGE_PROVIDER ?? "r2").trim().toLowerCase();
  if (raw === "r2" || raw === "s3") return raw;
  throw new Error(`STORAGE_PROVIDER không hợp lệ: "${raw}" (cho phép: r2 | s3)`);
}

export function getStorage(): StorageAdapter {
  if (_adapter) return _adapter;
  const provider = pickProvider();
  _adapter = provider === "r2" ? createR2Adapter() : createS3Adapter();
  return _adapter;
}

export type { StorageAdapter, StorageProvider } from "./types";
