# Storage providers

Hệ thống dùng adapter pattern — đổi `STORAGE_PROVIDER` trong env để switch backend, code service/UI không cần thay đổi.

## Contract

Mọi adapter implement [`StorageAdapter`](../src/server/storage/types.ts):

```ts
interface StorageAdapter {
  readonly provider: StorageProvider;
  presignPut(input): Promise<PresignedPut>;
  presignGet(key, ttlSec?): Promise<string>;
  putObject(input): Promise<PutObjectResult>;
  deleteObject(key): Promise<void>;
  getPublicUrl(key): string;
}
```

Service layer chỉ gọi `getStorage()` — không biết backend nào.

## Built-in providers

| Name | Free tier | Use case | Env vars cần |
|------|-----------|----------|--------------|
| `local` (default) | unlimited (đĩa) | Dev / VPS / self-hosted | (không) |
| `r2` | 10GB + 10M class A op/tháng | Production khuyến nghị (Cloudflare) | `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL` |
| `s3` | 5GB (12 tháng đầu) | AWS-native deploy | `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, optional `S3_PUBLIC_BASE_URL` |
| `backblaze` | 10GB + 1GB/day download | Cheap alternative R2 | `B2_BUCKET`, `B2_REGION`, `B2_ACCESS_KEY_ID`, `B2_SECRET_ACCESS_KEY`, optional `B2_ENDPOINT` + `B2_PUBLIC_BASE_URL` |
| `supabase` | 1GB | Đã dùng Supabase cho DB | `SUPABASE_PROJECT_REF`, `SUPABASE_BUCKET`, `SUPABASE_ACCESS_KEY_ID`, `SUPABASE_SECRET_ACCESS_KEY`, optional `SUPABASE_REGION` |

> `local` mặc định khi `STORAGE_PROVIDER` không set. Không deploy lên Vercel/serverless được (filesystem read-only).

## Stub providers (chưa wire)

| Name | Free tier | Trạng thái |
|------|-----------|------------|
| `gcs` | 5GB Standard (us-central-1) | [src/server/storage/gcs.ts](../src/server/storage/gcs.ts) — uncomment + `pnpm add @google-cloud/storage` |

## Thêm provider mới

Mọi provider mới chỉ cần 3 bước:

### Bước 1 — tạo file adapter

`src/server/storage/cloudinary.ts`:

```ts
import "server-only";
import type { StorageAdapter } from "./types";

export function createCloudinaryAdapter(): StorageAdapter {
  // implement 5 method của StorageAdapter dùng SDK của provider
  return {
    provider: "cloudinary",
    async presignPut({ key, contentType, ttlSec }) { ... },
    async presignGet(key, ttlSec) { ... },
    async putObject({ key, body, contentType }) { ... },
    async deleteObject(key) { ... },
    getPublicUrl(key) { ... },
  };
}
```

### Bước 2 — đăng ký trong factory

`src/server/storage/index.ts`:

```ts
import { createCloudinaryAdapter } from "./cloudinary";
registerStorage("cloudinary", createCloudinaryAdapter);
```

### Bước 3 — set env

`.env.local`:

```
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Done. Không cần đổi file nào khác — service/UI/API routes vẫn gọi `getStorage()` như cũ.

## Provider không dùng S3 API

Cloudinary / ImageKit / Firebase / UploadThing có SDK riêng. Implement đầy đủ 5 method, không reuse được `_s3-common.ts`. Xem [`gcs.ts`](../src/server/storage/gcs.ts) làm template.

## CORS

Khi browser upload trực tiếp qua presigned URL (Phase 6 R2/S3 production flow), bucket phải allow `PUT` từ domain frontend:

- **R2**: dashboard → bucket → Settings → CORS → JSON allow `["PUT"]` từ `https://*.vercel.app` + domain prod.
- **S3**: bucket → Permissions → CORS rule.
- **Supabase**: dashboard → Storage → bucket → Policies → INSERT cho anon/authenticated.
- **Backblaze**: B2 console → bucket → CORS rules.

Với `local` adapter (proxy upload qua `/api/admin/storage/upload`) không cần CORS.
