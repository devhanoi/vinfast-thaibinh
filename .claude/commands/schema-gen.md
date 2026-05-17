---
description: Sinh JSON-LD AutoDealer/LocalBusiness/FAQPage/Product/Breadcrumb cho dự án.
---

Khi user gọi /schema-gen, hãy:

1. Hỏi loại schema muốn sinh (nếu chưa rõ): `AutoDealer`, `Organization`, `FAQPage`, `Product`, `BreadcrumbList`, `WebSite`.
2. Đọc `src/lib/site.ts` để lấy NAP, URL, geo.
3. Xuất file vào `src/lib/schema/<name>.ts` dưới dạng hàm `export function build<Name>Schema(): WithContext<...>` strongly-typed.
4. Validate cấu trúc theo schema.org docs trước khi commit.
5. Thêm import + render `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(...)}} />` vào page liên quan.

Quy tắc:
- Không hard-code NAP trong schema file — luôn lấy từ `src/lib/site.ts`.
- `@context` luôn `https://schema.org`.
- Không dùng property deprecated.
