# Implementation Plan — Fullstack Refactor (v2)

> Lập 2026-05-24. Thay thế plan cũ. Mục tiêu: tách rõ FE / API / DB / Storage, dùng pattern phổ biến (NextAuth, TanStack Query, Zustand, shadcn, zod, Prisma, R2). Có thể tách BE thành service riêng trong tương lai mà không phải rewrite FE.

## 0. Bối cảnh

**Hiện trạng (origin `d39106e k`, do Codex auto-generate):** CMS scaffold sẵn — Prisma 11 models, R2 adapter sơ khai, shadcn/ui, bcrypt session, server actions. **Code chất lượng không đạt yêu cầu — KHÔNG follow pattern này.** Cụ thể những thứ cần làm lại / không bắt chước:
- Admin pages là Server Component gọi thẳng `prisma.*` hoặc `actions.ts` (cũng gọi prisma) → coupling cứng FE-DB.
- Public pages (`/`, `/xe/[slug]`) gọi `getHomePageData()` trỏ Prisma trực tiếp → khó test, khó tách BE.
- Không có API HTTP layer → mobile/external client không reuse được.
- Server actions trộn FE/BE concerns.
- Storage chỉ có R2, hard-code, không abstraction.
- Zustand + TanStack Query đã install nhưng chưa dùng.
- "k" commit revert phần cleanup "3S" của session trước (xem `memory/dealer_not_3s.md`). HeroSlider + Logo PNG của session trước trở thành orphan.

**Toàn bộ data layer + admin + storage sẽ được viết lại theo plan này.** Giữ lại: Prisma schema (models OK), shadcn primitives, seed script structure.

**Quyết định stack (đã chốt với user 2026-05-24):**
- DB: **Neon Postgres** (serverless, branching, connection pooling).
- Auth: **NextAuth v5 (Auth.js)** credentials provider.
- Storage: **adapter pattern** — interface `StorageAdapter` chung, 2 implementation (R2 + AWS S3). Đổi `STORAGE_PROVIDER=r2|s3` trong env là switch backend, code FE/service không cần biết. Upload theo **presigned URL** (browser PUT trực tiếp, không proxy bytes qua Vercel).
- API client: **REST + TanStack Query + Zod** (không tRPC để dễ tách BE).
- UI state: **Zustand** cho admin (filters, modal state, current-editing record).
- **Server Actions: BỎ hoàn toàn.** Mọi mutation admin đi qua REST API route + TanStack Query mutation. Lý do: actions trộn FE/BE, khó test, không reuse cho mobile/external client sau này.

## 1. Target architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│ Browser                                                             │
├─────────────────────────────┬───────────────────────────────────────┤
│  Public pages (SSR)         │  Admin pages (CSR)                    │
│  app/page.tsx               │  app/admin/**                         │
│  app/xe/[slug]/page.tsx     │  - Client components                  │
│  - Server components        │  - TanStack Query hooks               │
│  - Gọi service layer        │  - Zustand stores                     │
│    trực tiếp (same process) │  - fetch /api/admin/* (HTTP)          │
└──────────┬──────────────────┴────────────────┬──────────────────────┘
           │                                    │
           │ in-process call                    │ HTTP + zod parse
           ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ src/server/services/*       │  src/app/api/**/route.ts              │
│ Business logic, validation  │  - NextAuth session guard             │
│ Gọi repository + storage    │  - zod input parse                    │
│                             │  - call service                       │
│                             │  - return JSON (typed)                │
└──────────┬──────────────────┴──────────┬────────────────────────────┘
           │                              │
           └──────────────┬───────────────┘
                          ▼
        ┌────────────────────────────────────┐
        │ src/server/repositories/*          │
        │ Pure Prisma access, không validate │
        └──────────────┬─────────────────────┘
                       ▼
              ┌──────────────────┐    ┌──────────────────┐
              │ Prisma → Neon    │    │ R2 (presigned)   │
              └──────────────────┘    └──────────────────┘
```

**Tại sao public pages call service trực tiếp, KHÔNG qua HTTP API?** Cùng Node process → roundtrip HTTP nội bộ tốn ~5-15ms + serialization waste. SEO cần SSR sync với DB. Khi tách BE, ta chỉ cần đổi `services/*` thành HTTP client của BE service mới — interface giữ nguyên.

## 2. Layer responsibilities (cấm vi phạm)

| Layer | Path | Được phép | KHÔNG được |
|---|---|---|---|
| Repository | `src/server/repositories/*.ts` | Import `prisma`, CRUD raw | Validate input, gọi storage, throw business error |
| Service | `src/server/services/*.ts` | Gọi repo, gọi storage, validate via zod, throw `DomainError` | Import Next.js APIs (`headers`, `cookies`), trả `Response` |
| API route | `src/app/api/**/route.ts` | Parse request, guard auth, gọi service, format Response | Truy cập `prisma` trực tiếp, chứa business logic |
| Server component (public) | `src/app/page.tsx`, `src/app/xe/*` | Gọi service trực tiếp, render markup, metadata | Gọi `prisma`, gọi `fetch('/api/*')` |
| Client component (admin) | `src/app/admin/**`, `src/components/admin/**` | Dùng hooks TanStack Query / Zustand, gọi API qua client | Import `@/server/*` |

## 3. Lộ trình theo Phase

### Phase 0 — Cleanup divergence (bắt buộc trước)
- [ ] Re-apply 3S sweep mà "k" commit revert: hero-section, eyebrow, headline, layout metadata (theo `memory/dealer_not_3s.md`).
- [ ] **Refactor Hero**: chỉ là slider full-bleed, **không text/CTA overlay**. Tất cả chữ + button bị bỏ. Text giới thiệu + CTA chuyển xuống section ngay dưới (BenefitsStrip hoặc tạo "intro section" riêng).
- [ ] HeroSlider lấy slides từ DB (`services/hero.listActive()`) thay vì array cứng trong file. Fallback array khi chưa có DB.
- [ ] Quyết định Logo: giữ **`src/components/brand/vinfast-logo.tsx`** (SVG, scale tốt, không tốn bandwidth) → xóa `src/components/logo.tsx` (PNG) đã commit ở 0de12ba.
- [ ] Xóa `Unconfirmed 565015.crdownload` rác trong `public/images/slide/`.

### Phase 1 — Foundation (env, libs, types)
- [ ] `pnpm add next-auth@beta @auth/prisma-adapter` (NextAuth v5)
- [ ] Verify `@tanstack/react-query` + `zustand` đã có.
- [ ] Tạo `src/lib/zod/*` — schema dùng chung FE/BE per resource (product, hero, faq, testimonial, charging, lead, seo, store).
- [ ] Tạo `src/lib/api-client/fetcher.ts` — wrapper fetch với zod parse + error normalization.
- [ ] Tạo `src/app/providers.tsx` (đã có nhưng cần thêm `QueryClientProvider` + devtools).
- [ ] `.env.example` — thêm DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, R2_*, ADMIN_EMAIL/PASSWORD.

### Phase 2 — Repository + Service layer
- [ ] `src/server/repositories/{products,hero,faq,testimonials,charging,leads,store,seo}.ts` — đóng gói các Prisma query hiện ở `cms/data.ts` thành function pure (input → DB query → row).
- [ ] `src/server/services/{products,hero,faq,testimonials,charging,leads,store,seo,storage}.ts` — di chuyển business logic từ `actions.ts` + validation qua zod schema.
- [ ] `src/server/errors.ts` — `DomainError`, `NotFoundError`, `ValidationError` để API mapping HTTP status.
- [ ] Refactor `cms/data.ts` → forward sang services (giữ tạm để public pages chưa break), sau đó xóa.

### Phase 3 — NextAuth v5
- [ ] `src/server/auth/auth.ts` — config với `Credentials` provider, `PrismaAdapter`, session strategy `database`.
- [ ] `src/app/api/auth/[...nextauth]/route.ts` — handler.
- [ ] `middleware.ts` — guard `/admin/**` (trừ `/admin/login`).
- [ ] Migrate `prisma/schema.prisma` model `AdminUser`/`Session` sang shape NextAuth requires (`User`, `Account`, `Session`, `VerificationToken`). Giữ AdminUser nếu cần thêm field role; map qua relation.
- [ ] Xóa `src/server/auth/session.ts` cũ + bcrypt setup → NextAuth lo.

### Phase 4 — REST API routes
Quy ước: `/api/admin/{resource}` cho admin (yêu cầu session), `/api/public/{resource}` cho dữ liệu công khai (no auth, có thể cache CDN).

- [ ] `/api/admin/products` (GET list, POST create)
- [ ] `/api/admin/products/[id]` (GET, PATCH, DELETE)
- [ ] `/api/admin/products/[id]/images` (POST attach, DELETE detach)
- [ ] `/api/admin/hero` + `[id]`
- [ ] `/api/admin/faqs` + `[id]`
- [ ] `/api/admin/testimonials` + `[id]`
- [ ] `/api/admin/charging` + `[id]`
- [ ] `/api/admin/seo` + `[pageKey]`
- [ ] `/api/admin/store` (GET, PATCH key=site)
- [ ] `/api/admin/leads` (GET list, PATCH status)
- [ ] `/api/admin/storage/presign` (POST, return PUT URL cho R2)
- [ ] `/api/public/home` (GET, cache 5 min) — cho client/SPA scenario sau này
- [ ] Giữ `/api/lead` (public POST form từ landing).
- [ ] Helper `src/app/api/_lib/{handle,auth,validate}.ts` — wrap zod parse + session check + response shape `{data}` | `{error: {code, message, details?}}`.

### Phase 5 — Admin FE refactor
- [ ] `src/lib/api-hooks/use{Products,Hero,Faqs,Testimonials,Charging,Leads,Store,Seo}.ts` — TanStack Query hooks (queryKey theo resource, mutate invalidates).
- [ ] `src/lib/stores/admin-ui.ts` — Zustand store cho: open modal nào, đang edit record id nào, filters list, sidebar collapse.
- [ ] Refactor từng admin page thành client component:
  - `admin/products/page.tsx` — list + filter (Zustand) + invalidate (TanStack Query)
  - `admin/products/[id]/page.tsx` — form chi tiết (react-hook-form + zod resolver)
  - `admin/hero/page.tsx` — slide CRUD + drag-drop sort
  - `admin/content/page.tsx` — FAQ + testimonials tabs
  - `admin/leads/page.tsx` — table + status PATCH
  - `admin/store/page.tsx` — settings form
  - `admin/seo/page.tsx` — per-page SEO form
- [ ] Xóa `src/server/cms/actions.ts` sau khi FE không còn import.

### Phase 6 — Storage abstraction (R2 + AWS S3 swappable)
**Spec**: 1 interface, 2 implementation, switch bằng env `STORAGE_PROVIDER=r2|s3`. Service/API layer không cần biết backend nào.

- [ ] `src/server/storage/types.ts` — interface `StorageAdapter`:
  ```ts
  interface StorageAdapter {
    presignPut(input: { key: string; contentType: string; ttlSec?: number }): Promise<{ uploadUrl: string; publicUrl: string }>;
    delete(key: string): Promise<void>;
    getPublicUrl(key: string): string;
  }
  ```
- [ ] `src/server/storage/r2.ts` — `createR2Adapter()`. Dùng `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` với R2 endpoint (`https://<account>.r2.cloudflarestorage.com`). Public URL build từ `R2_PUBLIC_BASE_URL`.
- [ ] `src/server/storage/s3.ts` — `createS3Adapter()`. Cùng SDK, endpoint mặc định AWS, region `S3_REGION`, public URL `https://<bucket>.s3.<region>.amazonaws.com/<key>` hoặc CloudFront.
- [ ] `src/server/storage/index.ts` — factory:
  ```ts
  let _adapter: StorageAdapter | null = null;
  export function getStorage(): StorageAdapter {
    if (_adapter) return _adapter;
    switch (process.env.STORAGE_PROVIDER) {
      case "r2": _adapter = createR2Adapter(); break;
      case "s3": _adapter = createS3Adapter(); break;
      default: throw new Error(`STORAGE_PROVIDER must be r2|s3`);
    }
    return _adapter;
  }
  ```
- [ ] `src/server/services/storage.ts` — wrap `getStorage()`, thêm business rule: key convention `{resource}/{slug}/{uuid}.{ext}`, validate size ≤10MB, allowed content-types.
- [ ] `/api/admin/storage/presign` — accept `{filename, contentType, size, resource, slug}`, return `{uploadUrl, publicUrl, key}`.
- [ ] Admin image uploader client: drag-drop → `POST /api/admin/storage/presign` → `fetch(uploadUrl, { method: 'PUT', body: file, headers: {'Content-Type': contentType}})` → `POST /api/admin/products/[id]/images` với `{key, alt, color, angle}`.
- [ ] **CORS**: R2 và S3 mỗi cái có config khác nhau. Document trong `docs/STORAGE-SETUP.md`:
  - R2: dashboard → bucket → settings → CORS, allow `PUT` từ `https://*.vercel.app` + production domain.
  - S3: bucket → permissions → CORS JSON, same allow list.
- [ ] Env example:
  ```
  STORAGE_PROVIDER=r2
  # R2
  R2_ACCOUNT_ID=
  R2_ACCESS_KEY_ID=
  R2_SECRET_ACCESS_KEY=
  R2_BUCKET=
  R2_PUBLIC_BASE_URL=https://cdn.vinfast-thaibinh.com
  # S3 (chỉ cần khi STORAGE_PROVIDER=s3)
  S3_REGION=ap-southeast-1
  S3_ACCESS_KEY_ID=
  S3_SECRET_ACCESS_KEY=
  S3_BUCKET=
  S3_PUBLIC_BASE_URL=
  ```

### Phase 7 — Public landing polish
**Spec**: landing đẹp hơn hiện tại. Định hướng "premium automotive" (đen `#0A0A0A` / trắng / xanh VinFast `#00A664`).

- [ ] `app/page.tsx` — thay `getHomePageData()` (cms/data.ts) bằng gọi services trực tiếp.
- [ ] **Hero** = chỉ slider full-bleed, không chữ. Crossfade 5s, ken-burns zoom nhẹ trên ảnh. Indicator dot ở dưới.
- [ ] **Intro band** (section mới ngay dưới hero): 1 dòng tagline lớn + 2 CTA primary/secondary. Chiếm chỗ "text" mà hero đã bỏ.
- [ ] Polish các section: PriceTable bo viền + hover scale; CarGrid card có hover lift + ảnh zoom; FAQ accordion mượt; Testimonial card có quote icon.
- [ ] Sticky mobile CTA giữ nguyên nhưng style nhẹ hơn (blur + brand outline).
- [ ] Lazy-load các section dưới fold (`next/dynamic`), tránh hydrate hết JS upfront.

### Phase 8 — Product detail page `/xe/[slug]`
**Spec**: trang sâu cho từng dòng xe, click ảnh mở gallery dialog. Là page chính cho long-tail SEO.

- [ ] Server component fetch `services/products.getBySlug(slug)` → trả `{product, images, related}`. 404 nếu không tìm thấy.
- [ ] Layout (mobile-first):
  1. **Breadcrumb**: Trang chủ › Dòng xe › VF X
  2. **Gallery section** (top): ảnh hero lớn + thumb strip dọc (desktop) / ngang scroll (mobile). Click ảnh → mở dialog.
  3. **Info sidebar** (desktop) hoặc dưới gallery (mobile): tên xe, segment, giá từ, CTAs "Báo giá lăn bánh" + "Đặt lái thử" + "Gọi {hotline}".
  4. **Color picker**: list màu xe (filter `images.color`), click đổi grid ảnh đang show.
  5. **Highlights row**: 3-4 USP với icon (pin, range, AWD, ADAS...).
  6. **Spec table**: pin, quãng đường, motor (kW), 0-100 km/h, sạc DC/AC, kích thước, trọng lượng, khoang lái, bảo hành.
  7. **Trim/version comparison** (nếu có nhiều bản): table side-by-side.
  8. **Section "Vì sao chọn {model}"**: 3 paragraph + ảnh phụ.
  9. **Related cars** (cùng segment): 3-4 card horizontal scroll.
  10. **FAQ riêng cho model**: 3-5 câu (`Faq` model có thể thêm `productId` nullable để gắn).
- [ ] **Gallery dialog** `src/components/product/gallery-dialog.tsx` (client):
  - Trigger: click bất kỳ ảnh trong gallery section.
  - Dùng `<Dialog>` shadcn, fullscreen overlay đen `bg-black/95`.
  - Ảnh hiện tại fill viewport, giữ aspect ratio.
  - Navigation: nút ← → bên cạnh ảnh, keyboard `ArrowLeft`/`ArrowRight`, Esc close.
  - Counter `1 / 12` top-right.
  - Mobile: swipe horizontal (touch event hoặc dùng `embla-carousel-react` nếu cần).
  - Thumb strip ngang ở dưới (desktop only, hide mobile để full ảnh).
  - Preload ảnh kế tiếp + trước đó để swap nhanh.
- [ ] **SEO**:
  - `<title>`: `{name} Thái Bình – Giá lăn bánh từ {price} | VinFast {hotline}`
  - `<meta description>`: auto từ tagline + spec quan trọng (≤160 ký tự)
  - Canonical: `https://vinfast-thaibinh.com/xe/{slug}`
  - JSON-LD `Product` đầy đủ: `name`, `image[]`, `description`, `brand`, `model`, `offers` (price, availability), `additionalProperty` cho spec (pin, range)
  - Open Graph với ảnh primary của xe
  - Breadcrumb JSON-LD riêng cho trang này
- [ ] **Performance**:
  - Ảnh hero: `priority` + AVIF/WebP qua next/image
  - Thumb strip: lazy load
  - Gallery dialog: `dynamic(() => import(...), { ssr: false })` để không bloat initial bundle
- [ ] Link 2 chiều: card xe trong landing → `/xe/{slug}`; trên detail page có CTA về landing.

### Phase 9 — DX + deploy
- [ ] `pnpm db:migrate` (`prisma migrate dev`), `pnpm db:seed`, `pnpm db:studio` scripts.
- [ ] Update `package.json` scripts: xóa `seo:audit`/`snapshot:competitors` đang trỏ file không tồn tại.
- [ ] Vercel env: paste DATABASE_URL (Neon), NEXTAUTH_SECRET, R2_*.
- [ ] Neon: prod branch + preview branch (1 nhánh / PR).
- [ ] Smoke test admin login → create product → upload ảnh → publish → check public page.

## 4. File / module map (chốt sau Phase 4)

```
src/
├── app/
│   ├── (public)/          # Group cho SSR pages — service direct call
│   │   ├── page.tsx
│   │   └── xe/[slug]/page.tsx
│   ├── admin/             # Client components — fetch /api
│   ├── api/
│   │   ├── _lib/          # handle, auth guard, zod helpers
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── lead/route.ts            # public form
│   │   ├── admin/{resource}/        # all admin REST
│   │   └── public/{resource}/       # cached public JSON
│   └── providers.tsx
├── components/
│   ├── admin/             # Admin-only UI primitives
│   ├── brand/             # Logo
│   ├── sections/          # Public sections
│   └── ui/                # shadcn primitives
├── lib/
│   ├── api-client/        # fetcher + typed clients
│   ├── api-hooks/         # TanStack Query hooks
│   ├── stores/            # Zustand stores
│   ├── zod/               # shared schemas
│   ├── site.ts            # NAP fallback
│   └── utils.ts
└── server/
    ├── auth/auth.ts       # NextAuth config
    ├── db/prisma.ts
    ├── errors.ts
    ├── repositories/      # pure Prisma
    ├── services/          # business logic
    └── storage/           # R2 client + presign
```

## 5. Risks / open questions

- **Bcrypt → NextAuth migration**: existing admin user hash sẽ break. Plan: seed lại user qua NextAuth flow, hoặc giữ `passwordHash` column và viết Credentials authorize() function compare bcrypt.
- **Neon connection pooling**: Prisma không native pooler. Phải dùng Neon serverless driver (`@neondatabase/serverless` + `@prisma/adapter-neon`) hoặc PgBouncer connection string.
- **Image domain**: `next.config.ts` cần thêm `R2_PUBLIC_BASE_URL` vào `remotePatterns`.
- **Migration first deploy**: Neon prod branch chưa có data → cần chạy seed trước deploy, hoặc landing fallback về `src/content/*` (đã có `fallback.ts`).

## 6. Definition of Done

- [ ] `pnpm build` xanh, `pnpm typecheck` xanh, `pnpm lint` xanh.
- [ ] Admin có thể: login → list/create/edit/delete product → upload ảnh R2 → toggle hero slide → xem leads.
- [ ] Public landing `/` SSR hoàn chỉnh, không gọi prisma từ client bundle (verify bằng `pnpm build` analyze).
- [ ] Mọi mutation admin đi qua API route, không server action.
- [ ] Không còn import `@/server/*` từ `src/components/sections/*` hoặc `src/components/admin/*` (client).
- [ ] 3S sweep restored: grep "3S" chỉ còn trong file lock + competitor mention trong SEO-BRIEF.
- [ ] Lighthouse mobile ≥ 95 Perf / 100 SEO / 100 Best Practices / ≥ 95 A11y.
