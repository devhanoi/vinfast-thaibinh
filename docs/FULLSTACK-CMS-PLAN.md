# Fullstack CMS Cho VinFast Thái Bình

## Summary

Dự án chuyển từ landing page tĩnh sang Next.js fullstack CMS deploy trên Vercel. Public site vẫn render bằng Server Components/SSR có cache để giữ SEO và tốc độ. Database dùng Neon Postgres qua `DATABASE_URL`. Ảnh dùng Cloudflare R2 qua storage adapter để sau này đổi provider đơn giản.

## Stack

- Next.js App Router, Server Components, Server Actions.
- Prisma ORM + Neon Postgres.
- Cloudflare R2 S3-compatible storage.
- Email/password admin auth bằng session cookie.
- Public cache/revalidate sau mutation CMS.

## Scope v1

- Admin `/admin/login`, `/admin`.
- CMS sản phẩm, ảnh sản phẩm, hero, thông tin cửa hàng, SEO, FAQ, testimonials, trạm sạc, leads.
- Landing page `/` đọc dữ liệu từ loader server có fallback static khi chưa có `DATABASE_URL`.
- Trang chi tiết sản phẩm `/xe/[slug]` với metadata và Product JSON-LD riêng.

## Env

```bash
DATABASE_URL=
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE_URL=
```

## Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm build && pnpm lint && pnpm typecheck
```

## Notes

- DB chỉ lưu URL/key/metadata ảnh, không lưu binary.
- NAP seed từ `src/lib/site.ts`; không tự đổi hotline, địa chỉ, email.
- Nếu chưa cấu hình Neon, public page vẫn dùng fallback static để development/build không bị chặn.
