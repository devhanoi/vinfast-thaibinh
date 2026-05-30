import "server-only";
import type { StorageAdapter } from "./types";

type AdapterFactory = () => StorageAdapter;

const registry = new Map<string, AdapterFactory>();
let cached: StorageAdapter | null = null;

/**
 * Đăng ký một storage adapter với tên định danh (lowercase).
 * Gọi trước khi getStorage() được dùng lần đầu (idiom: trong storage/index.ts
 * hoặc app entry point).
 *
 * @example
 *   registerStorage("cloudinary", () => createCloudinaryAdapter());
 *   // Set STORAGE_PROVIDER=cloudinary trong env -> getStorage() trả adapter này
 */
export function registerStorage(name: string, factory: AdapterFactory): void {
  registry.set(name.trim().toLowerCase(), factory);
}

/**
 * Lấy storage adapter theo env STORAGE_PROVIDER (mặc định "local").
 * Cache singleton sau lần đầu — đổi env phải restart process.
 */
export function getStorage(): StorageAdapter {
  if (cached) return cached;
  const name = (process.env.STORAGE_PROVIDER ?? "local").trim().toLowerCase();
  const factory = registry.get(name);
  if (!factory) {
    const available = Array.from(registry.keys()).sort().join(", ");
    throw new Error(
      `STORAGE_PROVIDER "${name}" chưa đăng ký. Có sẵn: ${available}. ` +
        `Để thêm provider mới: registerStorage("ten", factory) trong src/server/storage/index.ts.`,
    );
  }
  cached = factory();
  return cached;
}

/** Test-only: clear cached singleton để swap provider giữa các test. */
export function _resetStorage(): void {
  cached = null;
}

/** Liệt kê providers đã đăng ký (debug / docs). */
export function listProviders(): string[] {
  return Array.from(registry.keys()).sort();
}
