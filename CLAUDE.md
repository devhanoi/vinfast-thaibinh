# CLAUDE.md — Dự án VinFast Thái Bình

> Tài liệu này được nạp vào mọi session. Giữ ngắn gọn. Quy tắc chi tiết nằm trong `docs/` và `.claude/rules/`.

## Mục đích dự án
Landing page tiếng Việt, **SEO-first**, nhắm Top 3 Google cho từ khóa **"vinfast thái bình"**. Đối thủ hiện tại (xem `docs/SEO-BRIEF.md`) có 800–2000 từ, thiếu schema markup, thiếu E-E-A-T, ít nội dung địa phương → đây là cơ hội vượt mặt.

## Tech stack (chốt)
- **Framework**: Next.js 16 (App Router), TypeScript, SSG + ISR.
- **Styling**: Tailwind CSS v4 + shadcn/ui.
- **Hosting**: Vercel (Edge + ISR), CDN ảnh next/image với AVIF/WebP.
- **Schema**: JSON-LD (`AutoDealer`, `LocalBusiness`, `Product`, `FAQPage`, `BreadcrumbList`, `Organization`).
- **Analytics**: GA4 + Google Search Console + Vercel Speed Insights.
- Lý do và alternatives: `docs/TECH-STACK.md`.

## Cấu trúc thư mục
```
.
├── CLAUDE.md             # File này
├── AGENTS.md             # Bản tóm lược cho non-Claude agents
├── README.md
├── docs/                 # Brief SEO, content, plan
├── .claude/
│   ├── settings.json     # Permissions & hooks
│   ├── commands/         # Slash commands
│   ├── agents/           # Subagent definitions
│   └── skills/           # Domain skills (seo-audit, schema-gen…)
├── src/
│   ├── app/              # Next.js routes (page.tsx, layout.tsx, sitemap.ts, robots.ts)
│   ├── components/       # UI components (kebab-case files)
│   ├── content/          # Copy + structured data sources (TS/MDX)
│   ├── lib/              # Helpers (schema builders, analytics, formatters)
│   └── types/
├── public/               # Ảnh tĩnh, favicon, OG images
└── tests/                # Playwright + Lighthouse CI
```

## Quy tắc làm việc
1. **SEO-first**: Mọi component/route mới phải qua checklist trong `docs/SEO-BRIEF.md` mục "Per-page SEO checklist".
2. **Bám brief, không tự phát minh**: Copy + section order do `docs/CONTENT-BRIEF.md` quyết định. Nếu cần đổi, đề xuất qua brief trước.
3. **Mobile-first**: Layout, ảnh, tap target ≥44px. Test mobile viewport trước desktop.
4. **Không block render**: CSS critical inline, JS non-critical phải `defer`/`dynamic`. KHÔNG dùng client component nếu không cần state/interaction.
5. **Ảnh**: Bắt buộc `next/image`, `priority` cho LCP element, `width`/`height` explicit, `alt` mô tả + chứa keyword tự nhiên.
6. **Schema**: Mỗi page xuất ít nhất 1 JSON-LD. Validate bằng `pnpm seo:schema-check` trước khi commit.
7. **Tiếng Việt**: `<html lang="vi">`. Copy theo tone tin cậy, không "hype". Số điện thoại format `0962.181.262` (đúng chuẩn đối thủ top 1).
8. **Đừng tạo file rác**: Không sinh `*.example.tsx`, `notes-*.md`, `temp-*` khi không được yêu cầu.

## Commands chuẩn (sẽ có sau khi setup)
- `pnpm dev` — dev server
- `pnpm build && pnpm start` — production build (chạy trước mọi deploy)
- `pnpm lint && pnpm typecheck`
- `pnpm test:e2e` — Playwright
- `pnpm seo:audit` — chạy Lighthouse + schema validation cục bộ
- `pnpm seo:schema-check` — JSON-LD validator

## Workflow chuẩn (theo `shinpr/ai-coding-project-boilerplate`)
**Requirements → Design → Plan → Implement → Review**
- Task nhỏ (≤1 component, ≤1 file): implement trực tiếp.
- Task vừa (1 section/route): đọc brief → implement → self-review checklist.
- Task lớn (đa route, đổi schema, đổi stack): viết plan ngắn vào `docs/IMPLEMENTATION-PLAN.md` trước.

## Self-review checklist (chạy trước khi report done)
- [ ] `pnpm build` xanh, không warning về metadata/Image.
- [ ] Lighthouse Mobile ≥ 95 Performance, 100 SEO, 100 Best Practices, ≥ 95 Accessibility.
- [ ] JSON-LD pass Rich Results Test (mock local).
- [ ] Mọi `<img>` đã thay bằng `next/image`.
- [ ] `<title>` ≤ 60 ký tự, `<meta description>` 140–160 ký tự, chứa keyword chính + biến thể.
- [ ] OG image 1200×630 đã được generate.
- [ ] Sitemap.xml và robots.txt có URL mới.

## Việc KHÔNG được tự ý làm
- Thay đổi từ khóa mục tiêu, hotline, địa chỉ showroom (xem `docs/CONTENT-BRIEF.md`).
- Push code, deploy, tạo branch mới, force-push.
- Cài thêm dependency nặng (>50KB gzipped) mà không hỏi.
- Tạo file markdown rời rạc ngoài `docs/` để "ghi chú".
