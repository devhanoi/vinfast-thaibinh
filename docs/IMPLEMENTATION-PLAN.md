# Implementation Plan

## Phase 0 — Harness (xong)
- [x] Research SERP
- [x] Viết CLAUDE.md, AGENTS.md, README, brief SEO + content + stack

## Phase 1 — Bootstrap & xem giao diện đối thủ
1. Cài Playwright (`pnpm add -D playwright`) + browser binaries (`pnpm exec playwright install chromium`).
2. Viết script `scripts/snapshot-competitors.mjs` chụp screenshot mobile + desktop của top 5 đối thủ vào `docs/competitors/`.
3. Phân tích visual: layout hero, palette, font, CTA position → ghi notes vào `docs/competitors/NOTES.md` (chỉ vài bullet, không file dài).

## Phase 2 — Scaffold Next.js
1. `pnpm create next-app@latest . --ts --tailwind --app --src-dir --eslint --no-import-alias --use-pnpm` (ghi đè cẩn thận, giữ docs/ và CLAUDE.md).
2. Cài thêm: `pnpm add lucide-react react-hook-form zod clsx tailwind-merge`.
3. Cài shadcn: `pnpm dlx shadcn@latest init`, add `button input form sheet accordion`.
4. Setup `src/lib/site.ts` (NAP constants), `src/content/cars.ts`.
5. Setup `next.config.ts`: image domains, redirects www/non-www, security headers.
6. Setup font (`next/font/google` Inter + Be Vietnam Pro, subset `vietnamese`, `display: swap`).

## Phase 3 — Build page `/`
Triển khai section theo thứ tự trong `CONTENT-BRIEF.md`:
1. `<SiteHeader/>` (Server component)
2. `<HeroSection/>` (LCP ảnh hero priority)
3. `<BenefitsStrip/>`
4. `<PriceTable/>` (Server, dùng `<table>` semantic)
5. `<CarGrid/>` (data từ `src/content/cars.ts`)
6. `<ServiceCarsSection/>`
7. `<BikesSection/>` (lazy ảnh)
8. `<FinanceSection/>` (Server, tính trả góp tĩnh)
9. `<TestDriveForm/>` ("use client", RHF + Zod, POST `/api/lead`)
10. `<ChargingMapSection/>` (Maps embed lazy + accordion 15 trạm)
11. `<AftersalesSection/>`
12. `<WhyUsSection/>` (E-E-A-T)
13. `<TestimonialsSection/>` (tĩnh, optional Review schema)
14. `<FaqSection/>` (Server, FAQPage schema inline)
15. `<ContactFooterSection/>` (Maps embed lazy)
16. `<StickyMobileCTA/>` ("use client", chỉ render <md breakpoint)

## Phase 4 — SEO infrastructure
1. `src/app/layout.tsx`: `<html lang="vi">`, meta defaults, `next/font`, Theme color, manifest.
2. `src/app/page.tsx` metadata: title/description/OG/Twitter/canonical/alternates.
3. `src/app/sitemap.ts` + `src/app/robots.ts`.
4. `src/lib/schema/`:
   - `auto-dealer.ts` — AutoDealer + LocalBusiness merged
   - `organization.ts`
   - `website.ts`
   - `breadcrumb.ts`
   - `faq.ts`
   - `product.ts` (loop 6 xe)
5. Inject JSON-LD qua `<script type="application/ld+json">` trong page.tsx.
6. `public/robots.txt` (nếu Next 16 cần backup), `public/site.webmanifest`, `public/favicon.ico`, OG image.

## Phase 5 — Lead API
- `src/app/api/lead/route.ts`: POST, validate Zod, gửi email qua Resend (env `RESEND_API_KEY` — placeholder, để TODO), trả 200 JSON `{ok:true}`.
- Rate-limit ngắn bằng IP map in-memory (đủ cho Phase 1).
- Honeypot field chống bot.

## Phase 6 — Performance & QA
1. `pnpm build` → kiểm size bundle, fail nếu vượt budget.
2. Chạy Lighthouse CI mobile + desktop (`pnpm seo:audit`).
3. Validate JSON-LD bằng script local (parse + check required fields).
4. Test Playwright: smoke render page, click form, submit happy path.
5. Manual checklist trong `SEO-BRIEF.md` mục 8.

## Phase 7 — Pre-launch
- [ ] Thay ảnh placeholder bằng ảnh thật.
- [ ] Cập nhật giá xe từ bảng chính thức VinFast tháng phát hành.
- [ ] Verify Google Search Console & submit sitemap.
- [ ] Tạo Google Business Profile cho NAP khớp.
- [ ] Set up GA4 stream, dán measurement ID vào `NEXT_PUBLIC_GA_ID`.

## Định nghĩa "Done" cho mỗi PR
- `pnpm build && pnpm lint && pnpm typecheck` xanh.
- Lighthouse mobile Perf ≥95, SEO 100, BP 100, A11y ≥95.
- Schema validate pass.
- Không file rác mới ngoài structure đã định.
- Screenshot mobile + desktop attach vào PR description.
