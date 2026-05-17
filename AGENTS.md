# AGENTS.md

Tài liệu này dành cho mọi AI agent (Claude Code, Cursor, Codex, Copilot…) làm việc trên repo. Là bản rút gọn của `CLAUDE.md`.

## TL;DR
- **Mục tiêu**: SEO landing page nhắm Top 3 Google cho từ khóa `vinfast thái bình`.
- **Ngôn ngữ**: Tiếng Việt (`lang="vi"`).
- **Stack**: Next.js 15 App Router + TypeScript + Tailwind v3 + Be Vietnam Pro. SSG/ISR. Deploy Vercel.
- **Đọc trước khi code** (theo thứ tự):
  1. `docs/AGENT-HANDOFF.md` (state + lessons từ session trước)
  2. `CLAUDE.md` (rules chính)
  3. `docs/SEO-BRIEF.md`
  4. `docs/CONTENT-BRIEF.md`
  5. `docs/TECH-STACK.md`
  6. `docs/IMPLEMENTATION-PLAN.md`

## Quy ước nhanh
- Server components mặc định. `"use client"` chỉ khi cần state/interaction.
- Ảnh dùng `next/image` (priority + width/height bắt buộc cho LCP element).
- File JSON-LD ở `src/lib/schema/*.ts` rồi inject qua `<Script type="application/ld+json">`.
- Tên file: kebab-case. Tên component: PascalCase. Hook: `useXxx`.
- Test trước khi báo xong: `pnpm build && pnpm lint && pnpm typecheck`.

## NAP (Name–Address–Phone) — không được sửa
- **Tên**: VinFast Thái Bình (Đại lý ủy quyền 3S)
- **Hotline**: 0962.181.262 (Mr. Khánh)
- **Email**: khanhvinfast17@gmail.com
- **Địa chỉ**: Đại Lộ Kỳ Đồng, KĐT Thái Bình Dragon City, Phú Xuân, TP. Thái Bình
- **Giờ mở cửa**: T2–T7 07:30–18:30; CN 08:00–17:00
