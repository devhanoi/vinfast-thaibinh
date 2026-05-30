import "server-only";
import { createR2Adapter } from "./r2";
import { createS3Adapter } from "./s3";
import { createLocalAdapter } from "./local";
import type { StorageAdapter, StorageProvider } from "./types";

let _adapter: StorageAdapter | null = null;

function pickProvider(): StorageProvider {
  const raw = (process.env.STORAGE_PROVIDER ?? "local").trim().toLowerCase();
  if (raw === "r2" || raw === "s3" || raw === "local") return raw;
  throw new Error(`STORAGE_PROVIDER không hợp lệ: "${raw}" (cho phép: r2 | s3 | local)`);
}

export function getStorage(): StorageAdapter {
  if (_adapter) return _adapter;
  const provider = pickProvider();
  _adapter =
    provider === "r2"
      ? createR2Adapter()
      : provider === "s3"
        ? createS3Adapter()
        : createLocalAdapter();
  return _adapter;
}

export type { StorageAdapter, StorageProvider } from "./types";
