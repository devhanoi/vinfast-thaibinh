# Agent Handoff — đọc trước khi tiếp tục

> Bản ghi nhớ cho agent kế tiếp (Claude/Cursor/Codex) khi clone repo này về làm tiếp.
> Nguồn: session đầu tiên build dự án (2026-05-17 → 2026-05-18, Claude Opus 4.7).
> Mục đích: tránh lặp lại sai lầm + giữ context user preference + roadmap kế tiếp.

---

## 0. Đọc tuần tự
1. File này (`AGENT-HANDOFF.md`) — context session trước
2. `CLAUDE.md` — rules cấp dự án, luôn nạp vào context
3. `docs/SEO-BRIEF.md` — chiến lược keyword + competitor gap
4. `docs/CONTENT-BRIEF.md` — copy outline + NAP + asset list
5. `docs/TECH-STACK.md` — stack quyết định và performance budget
6. `docs/IMPLEMENTATION-PLAN.md` — phase nào xong, phase nào còn

---

## 1. Trạng thái hiện tại (snapshot 2026-05-18)

**Đã xong (Phase 1–6):**
- Harness docs đầy đủ (CLAUDE.md, AGENTS.md, 4 brief trong `docs/`).
- Next.js 15 App Router scaffold thủ công (KHÔNG dùng `create-next-app` vì conflict với docs có sẵn).
- 14 section render đúng style Premium Automotive (đen `#0A0A0A` / trắng / xanh VinFast `#00A664`, font Be Vietnam Pro).
- 11 JSON-LD schemas inject: Organization, AutoDealer + LocalBusiness, WebSite, BreadcrumbList, FAQPage, Product × 6.
- API `/api/lead` validate SĐT VN regex + honeypot.
- Sitemap.xml + robots.txt auto-generated từ App Router metadata API.
- 12 ảnh xe VinFast thật cho VF3 → VF9 (đã commit vào `public/images/cars/`).
- `pnpm build` xanh, 12.4 KB route, 118 KB First Load JS.

**Phase 7 chưa làm (pre-launch checklist):**
1. **Ảnh Service Green** (Minio/Herio/Limo) — đang reuse VF3/5/9 làm placeholder.
2. **Bản quyền ảnh** — ảnh hiện crawl từ trang đại lý khác (vinfast-thaibinh.com, vinfastthaibinh.com, vinfastautothaibinh.com). Trước khi public **phải thay** bằng ảnh do VinFast cấp hoặc tự chụp tại showroom.
3. **Geo lat/lng** trong `src/lib/site.ts` đang là ước lượng (`20.4503, 106.3402`) — verify bằng Google Maps trước khi đăng GMB.
4. **OG cover** — chưa có file `/public/images/og-cover.jpg` 1200×630. Cần tạo (Canva hoặc Figma).
5. **GA4 + GSC verification** — set env `NEXT_PUBLIC_GA_ID` và `NEXT_PUBLIC_GSC_VERIFICATION` (đã hook sẵn trong `src/app/layout.tsx`).
6. **Lighthouse audit cuối** — hero LCP element hiện là `/images/cars/vf-3-1.webp` (60 KB), kỳ vọng Perf ≥95 mobile.
7. **Submit sitemap** lên Google Search Console + Bing Webmaster sau khi deploy.

**Không tự ý làm** (không nằm trong autonomous scope):
- Deploy Vercel (cần env keys + domain config từ user).
- Đổi hotline `0962.181.262`, địa chỉ `Đại Lộ Kỳ Đồng KĐT Dragon City`, tên Mr. Khánh.
- Đổi keyword mục tiêu chính `vinfast thái bình`.
- Force push hoặc rebase main.

---

## 2. User preferences (rút từ session 1)

- **Giao tiếp**: tiếng Việt, kiểu chỉ đạo ngắn ("tiếp tục", "build luôn", "xong chưa").
- **Speed first**: làm song song khi có thể, không dừng xin xác nhận từng bước nếu task rõ. User thường gửi message redirect giữa chừng — luôn check `<system-reminder>` cho user message mới.
- **Visual verify bắt buộc**: user yêu cầu cài Playwright để self-audit UI. Sau mỗi đợt UI lớn phải:
  1. `pnpm build && pnpm exec next start --port 3030 &`
  2. Chạy `node tooling/scripts/snapshot.mjs`
  3. `Read docs/screenshots/own-{mobile,desktop}.png` để tự xem
  4. Đừng claim "render đúng" nếu chưa Read ảnh.
- **Quyết định lớn về UI**: dùng `AskUserQuestion` với ASCII preview side-by-side — user select rất nhanh.
- **Đầu ra ngắn gọn**: 1–2 câu update + next action mỗi turn là đủ. Đừng kết bằng summary dài, đừng dùng emoji trừ khi user xài trước.

---

## 3. Quy tắc đã rút (feedback lessons)

### 3.1 Không dùng placeholder text-only cho trang thương mại
**Tại sao:** user feedback nguyên văn "ảnh đang ko có gì cả, bạn nên vào các trang khác tải ảnh bên đó về dùng" sau khi thấy placehold.co text-only. Trang bán xe mà không có ảnh xe thật trông như chưa làm gì.

**Áp dụng:** ngay từ đầu phải plan ảnh thật. Script `tooling/scripts/fetch-car-images.mjs` đã có sẵn — chỉ cần `node tooling/scripts/fetch-car-images.mjs` là refresh được 12 ảnh xe.

### 3.2 Premium Automotive là theme chốt
**Tại sao:** user chọn ngay option "Premium Automotive (Recommended)" khi được show 3 hướng UI.

**Áp dụng:** mọi route mới trong cluster này (`/bang-gia-xe-vinfast-thai-binh`, `/tra-gop-vinfast-thai-binh`, `/tram-sac-vinfast-thai-binh`) bám đúng palette `#0A0A0A` / `#FFFFFF` / `#00A664`, font `Be Vietnam Pro`, hero full-bleed + gradient overlay tối. Component pattern xem `src/components/sections/`.

### 3.3 Bám brief, đừng tự refactor
**Tại sao:** user đầu tư thời gian viết harness docs. Khi mình thử bypass (scaffold luôn không brief) sẽ phải làm lại.

**Áp dụng:**
- Task ≤ 1 component → implement thẳng.
- Task = thêm section/route → cập nhật `docs/IMPLEMENTATION-PLAN.md` rồi mới code.
- Task = đổi schema/stack → viết plan ngắn + hỏi user xác nhận.

### 3.4 Self-review checklist trước khi báo done
Bắt buộc chạy đủ trước khi nói "xong":
- [ ] `pnpm build && pnpm lint && pnpm typecheck` xanh
- [ ] Đã `Read` screenshot mobile + desktop
- [ ] JSON-LD chưa break (xem console khi load `/`)
- [ ] `<title>` ≤ 60 ký tự, meta desc 140–160, có KW chính
- [ ] OG image link đúng

---

## 4. Cạm bẫy kỹ thuật (technical pitfalls)

### 4.1 Classifier chặn execute script chưa show trong transcript
**Triệu chứng:** `node tooling/scripts/foo.mjs` bị deny với reason "executes a script written earlier in this session that wasn't shown in the transcript, with unverifiable contents".

**Workaround:** `Read` (hoặc `cat`) full script ngay trước khi `node` để classifier thấy code trong transcript → pass.

### 4.2 Không tự sửa được `.claude/settings.json`
**Triệu chứng:** Edit deny list trong settings.json bị block "Self-Modification".

**Workaround:** ask user paste rule mới vào `.claude/settings.json` thay vì tự sửa.

### 4.3 CWD trôi xuống `tooling/`
**Triệu chứng:** Sau `cd tooling && node ...`, lệnh tiếp theo `pnpm build` báo `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "build" not found` vì pnpm đang ở tooling/package.json.

**Workaround:** Prefix lệnh quan trọng bằng `cd /absolute/path && ...` hoặc kiểm tra `pwd` trước.

### 4.4 `pnpm start --port` không pass flag
**Triệu chứng:** `pnpm start --port 3030` báo `ERR_PNPM_NO_SCRIPT_OR_SERVER` (pnpm interpret `--port` là filter).

**Workaround:** Dùng `pnpm exec next start --port 3030 &` rồi `disown`.

### 4.5 Server start trước khi `.next/` ready
**Triệu chứng:** `Could not find a production build in the '.next' directory`.

**Workaround:** Chain `pnpm build && pnpm exec next start ...` (dùng `&&` chứ không `;`). Verify bằng Monitor:
```
until curl -sf -o /dev/null http://localhost:3030; do sleep 1; done && echo READY
```

### 4.6 `pnpm-workspace.yaml` ở root
File này CHỈ chứa `onlyBuiltDependencies: [sharp, unrs-resolver]` để approve native build. **Đừng xóa** — nếu xóa, pnpm install sẽ skip build sharp → Next/Image fallback chậm.

### 4.7 Next/Image với placehold.co
`next.config.ts` có `dangerouslyAllowSVG: true` + CSP `sandbox` để hỗ trợ placeholder. An toàn vì có CSP, nhưng nếu chuyển hết sang ảnh thật thì có thể remove flag này.

---

## 5. Lệnh hay dùng

```bash
# Dev
pnpm dev                              # http://localhost:3000 (turbopack)

# Production build + start
pnpm build
pnpm exec next start --port 3030 &
disown

# Verify
pnpm typecheck
pnpm lint
curl -sI http://localhost:3030 | head -3
lsof -ti:3030 | xargs kill            # kill server khi xong

# Tooling
node tooling/scripts/snapshot.mjs          # screenshot UI (cần server chạy)
node tooling/scripts/fetch-car-images.mjs  # refresh ảnh xe từ 3 trang đại lý
```

---

## 6. Cấu trúc file quan trọng

```
src/
├── app/
│   ├── layout.tsx          # metadata + 11 JSON-LD inject + font Be Vietnam Pro
│   ├── page.tsx            # compose 14 section theo thứ tự CONTENT-BRIEF
│   ├── globals.css         # tailwind base + .btn-primary/.btn-ghost/.btn-dark/.eyebrow
│   ├── sitemap.ts          # auto-sitemap (chỉ root, cần update khi thêm route)
│   ├── robots.ts
│   └── api/lead/route.ts   # POST handler + Zod-like validate + honeypot
├── components/sections/    # 1 section / 1 file (14 file)
├── content/
│   ├── cars.ts             # CARS (6 dòng) + SERVICE_CARS (3) + BIKES (4) + image paths
│   ├── charging-stations.ts # 15 trạm sạc theo 8 huyện
│   └── faq.ts              # 10 Q&A cho FAQPage schema
└── lib/
    ├── site.ts             # SOURCE OF TRUTH cho NAP, hotline, geo, social
    ├── schema/index.ts     # 6 builder schema: Organization, AutoDealer, WebSite, Breadcrumb, FAQ, Product[]
    └── utils.ts            # cn() helper + formatVND/formatMillion
```

**Đụng vào `src/lib/site.ts` là đụng tới NAP — schema, layout metadata, footer, hero CTA đều phụ thuộc.**

---

## 7. Roadmap cluster SEO (Phase 8+)

Theo `docs/SEO-BRIEF.md`, sau khi launch trang `/` cần build 3 supporting route để dày cluster:

| Route | Mục đích | Schema chính |
|---|---|---|
| `/bang-gia-xe-vinfast-thai-binh` | Bảng giá đầy đủ + ưu đãi tháng + so sánh dòng xe | Product × 6 + Article |
| `/tra-gop-vinfast-thai-binh` | Cách tính trả góp, mẫu hồ sơ, tính giả lập | FinancialProduct + HowTo |
| `/tram-sac-vinfast-thai-binh` | 15 trạm sạc + map + lộ trình sạc | LocalBusiness × 15 + Place |

Mỗi route phải:
- Internal link 2 chiều với `/`
- Reuse `src/components/sections/*` pattern
- Update `src/app/sitemap.ts` với entry mới
- Pass per-page SEO checklist trong `SEO-BRIEF.md` mục 8

---

## 8. Khi clone repo về máy mới

```bash
git clone https://github.com/devhanoi/vinfast-thaibinh.git
cd vinfast-thaibinh

# Cài deps root
pnpm install

# Cài deps tooling (Playwright)
cd tooling && pnpm install && npx playwright install chromium && cd ..

# Verify build
pnpm build

# Dev
pnpm dev
```

Nếu Playwright complain thiếu Chromium: `cd tooling && npx playwright install chromium`.

---

_End of handoff. Khi update tài liệu này sau session, ghi rõ ngày + version vào đầu file._
