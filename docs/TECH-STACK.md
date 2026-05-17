# Tech Stack — Quyết định & lý do

## Lựa chọn cuối
| Layer | Chốt | Phiên bản | Lý do chính |
|-------|------|-----------|------------|
| Framework | **Next.js (App Router)** | 16.x | SSG/ISR cho SEO, image optimizer, metadata API, edge runtime, hệ sinh thái lớn nhất cho landing SEO Việt Nam. |
| Language | **TypeScript** | 5.x strict | An toàn cho schema markup phức tạp. |
| Styling | **Tailwind CSS** + **shadcn/ui** | v4 / latest | Build nhanh, CSS critical inline, không runtime JS. |
| Form | React Hook Form + Zod | latest | Validation client + server, gửi lead qua route handler. |
| Animation | Framer Motion (chỉ khi cần) | latest | Tránh CLS, chỉ animate transform/opacity. |
| Icons | lucide-react | latest | Tree-shakeable. |
| Schema markup | Tự viết trong `src/lib/schema/` | — | Type-safe, không phụ thuộc lib ngoài. |
| Analytics | GA4 + Vercel Speed Insights + Search Console | — | Đo CWV thật + ranking. |
| Hosting | **Vercel** | — | ISR native, edge CDN VN, free SSL, preview deploy. |
| Package manager | **pnpm** | latest | Cài nhanh, tiết kiệm dung lượng. |
| Lint/format | ESLint (next/core-web-vitals) + Prettier + Tailwind plugin | latest | — |
| Test | Playwright + Lighthouse CI | latest | E2E smoke + perf gate trong CI. |

## Alternatives đã cân nhắc và lý do loại
- **Astro**: tốt cho content-heavy nhưng hệ partial hydration phức tạp hơn cần thiết; team Việt quen Next hơn.
- **WordPress/Elementor**: cách đối thủ đang dùng — nặng, CWV kém, khó tùy biến schema. **Đây chính là điểm vượt mặt.**
- **Static HTML thuần**: nhanh nhưng khó scale Phase 2 (thêm 3 route, form lead).
- **Remix**: thiếu native ISR như Next 16.

## Convention code
- `src/app/page.tsx` — route `/`. Server component.
- `src/app/(marketing)/` — group route nếu mở rộng.
- `src/components/sections/<name>.tsx` — mỗi section một file.
- `src/components/ui/*` — shadcn primitives.
- `src/lib/schema/*.ts` — mỗi schema một file, export hàm trả về object JSON-LD typed.
- `src/lib/site.ts` — single source of truth cho NAP, hotline, URL canonical.
- `src/content/cars.ts` — data sản phẩm (id, name, price, range, battery, img).

## Performance budget (CI fail nếu vượt)
| Metric | Mobile | Desktop |
|--------|--------|---------|
| LCP | ≤ 1.8s | ≤ 1.2s |
| CLS | ≤ 0.05 | ≤ 0.05 |
| INP | ≤ 200ms | ≤ 150ms |
| Total JS (gzipped) | ≤ 110KB | ≤ 110KB |
| Total ảnh trên fold | ≤ 250KB | ≤ 400KB |
| Lighthouse Perf | ≥ 95 | ≥ 98 |
| Lighthouse SEO | 100 | 100 |
| Lighthouse Best Practices | 100 | 100 |
| Lighthouse A11y | ≥ 95 | ≥ 95 |

## Không dùng
- jQuery, Bootstrap, GSAP (nặng).
- Web fonts >2 family. Dùng `next/font` với Inter + Be Vietnam Pro (preload subset `vietnamese`).
- Chat widget bên thứ 3 chặn render (Tawk, Crisp) — nếu cần, lazy load sau `requestIdleCallback`.
