# SEO Brief — Từ khóa "vinfast thái bình"

## 1. Mục tiêu
- **Primary KW**: `vinfast thái bình` — Top 3 Google.com.vn trong 60–90 ngày.
- **Secondary KWs** (cluster cùng intent):
  - `đại lý vinfast thái bình`
  - `showroom vinfast thái bình`
  - `vinfast 3s thái bình`
  - `mua xe vinfast thái bình`
  - `giá xe vinfast thái bình`
  - `lái thử vinfast thái bình`
  - `trả góp vinfast thái bình`
  - `vinfast vf3 / vf5 / vf6 / vf7 / vf8 / vf9 thái bình`
  - `xe máy điện vinfast thái bình`
  - `trạm sạc vinfast thái bình`
  - `sửa chữa / bảo dưỡng vinfast thái bình`

## 2. SERP snapshot (Google.com.vn — tháng 5/2026)
| # | URL | Title đang dùng | Strengths | Weaknesses (gap để khai thác) |
|---|-----|-----------------|-----------|-------------------------------|
| 1 | vinfast-thaibinh.com | "VinFast Thái Bình ǀ Đại Lý Xe Ôtô VinFast Tại Thái Bình - 0962.181.262" | Brand domain match exact KW, hotline trong title, danh mục đầy đủ VF3–VF9, tin tức | Không meta description rõ, ít schema, copy ngắn (~1.5k từ), không có FAQ, không có map embed |
| 2 | vinfastautothaibinh.com | "VinFast Thái Bình - Showroom chính hãng tại Thái Bình" | Có cả ô tô + xe máy điện, dịch vụ rõ | Không H1, copy ngắn (~1k từ), thiếu schema, hotline khác |
| 3 | vin3sthaibinh.com | "Vinfast Thái Bình ǀ Mua Xe Máy Điện Vinfast Tại Thái Bình" | Focus xe máy điện | Intent lệch (ưu tiên xe máy), nội dung mỏng |
| 4 | facebook.com/vinfastthanglong.vn | FB page | Trust signal social | Không cạnh tranh organic mạnh |
| 5 | vinfastthaibinh.com | "VINFAST THÁI BÌNH" | Form báo giá rõ, có dropdown dòng xe | Title quá ngắn, không meta desc, H1 chỉ là logo |
| 6 | vinfast-thaibinh3s.com | — | Domain match "3s" | Nội dung mỏng, ít authority |
| 7 | vinfastthaibinh.net | — | Domain match | — |
| 8 | vinfastauto.com/.../tram-sac... | Trang chính hãng VinFast về trạm sạc TB | Authority hãng | Intent khác (trạm sạc) |
| 9 | vinfasttb.com | — | — | — |
| 10 | vinfastthaibinh.bonbanh.com | Bonbanh listing | Authority site bonbanh | Format catalog, không phải landing |

### Kết luận SERP
- Intent chính: **transactional + local** (tìm đại lý, hotline, bảng giá, lái thử).
- Tất cả top 10 đều là trang đại lý local hoặc page giới thiệu showroom. **Không có blog/article** → ta có thể dùng landing đơn (single page) sâu, không cần multi-page blog.
- **Khoảng trống rõ rệt**:
  1. Không trang nào có **JSON-LD AutoDealer/LocalBusiness/FAQPage** hoàn chỉnh.
  2. Không trang nào có **embed Google Maps + danh sách 15 trạm sạc** Thái Bình.
  3. Không có **bảng so sánh dòng xe** dạng table có thể vào Featured Snippet.
  4. Không có **FAQ schema** trả lời các câu thường gặp (vay bao nhiêu %, bao lâu giao xe, có nhận trade-in không…).
  5. Không có **tốc độ Core Web Vitals tốt** (đa số dùng WordPress nặng).
  6. Không có **video review/lái thử** embed.
  7. Thiếu **E-E-A-T**: không có thông tin tư vấn viên thật (ảnh, bio, kinh nghiệm).

## 3. Chiến lược nội dung & on-page
Áp dụng pillar single-page sâu ~2.500–3.500 từ + 3 supporting routes:

```
/                                  # Pillar: Đại lý VinFast Thái Bình (KW chính)
/bang-gia-xe-vinfast-thai-binh     # Bảng giá đầy đủ + ưu đãi tháng
/tra-gop-vinfast-thai-binh         # Cách tính trả góp, mẫu hồ sơ
/tram-sac-vinfast-thai-binh        # Danh sách 15 trạm sạc + map
```

(Phase 1 chỉ build `/` để launch nhanh, Phase 2 build 3 trang còn lại.)

## 4. On-page targets (cho trang `/`)
- **Title (≤60 ký tự)**: `VinFast Thái Bình | Đại lý 3S chính hãng – 0962.181.262`
- **Meta description (155 ký tự)**: `Đại lý VinFast Thái Bình 3S chính hãng tại Đại Lộ Kỳ Đồng – báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí. Hotline 0962.181.262.`
- **H1 (1 lần duy nhất)**: `Đại lý VinFast Thái Bình – Showroom 3S chính hãng tại TP. Thái Bình`
- **URL slug**: `/` (root). Canonical `https://vinfast-thaibinh.com/`.
- **OG**: image 1200×630 ảnh showroom + logo, `og:locale=vi_VN`.
- **hreflang**: `vi-VN` only.

### Mật độ từ khóa (target tự nhiên)
- `vinfast thái bình`: 8–12 lần trong 3.000 từ (~0.4%).
- `đại lý vinfast`: 4–6 lần.
- `showroom vinfast thái bình`: 3–4 lần.
- Các biến thể VF3…VF9 + "thái bình": mỗi cái 1–2 lần.

## 5. Schema markup bắt buộc
1. **AutoDealer** (kế thừa `LocalBusiness`): name, address, geo, telephone, openingHoursSpecification, areaServed, makesOffer, image, sameAs (FB, Zalo).
2. **Organization**: logo, legal name, contactPoint.
3. **BreadcrumbList**: Home > Đại lý > Thái Bình.
4. **FAQPage**: 8–10 cặp Q&A (xem `CONTENT-BRIEF.md`).
5. **Product** × 6 dòng xe (VF3–VF9) với offers + price range.
6. **WebSite** với `potentialAction: SearchAction`.

## 6. Technical SEO checklist
- [ ] `robots.txt` allow all, link sitemap.
- [ ] `sitemap.xml` tự sinh (Next.js `app/sitemap.ts`).
- [ ] `<link rel="canonical">` mỗi route.
- [ ] HTTPS, HTTP/2, preload font, `font-display: swap`.
- [ ] Tất cả ảnh `next/image` AVIF/WebP, `priority` cho hero.
- [ ] LCP element là ảnh hero VF5 (preloaded).
- [ ] Không inline ảnh >40KB; SVG inline cho logo.
- [ ] Lazy load iframe Google Maps (`loading="lazy"`).
- [ ] Mobile-first responsive, tap target ≥44px.
- [ ] CLS=0 (mọi ảnh có width/height, không inject content sau load).
- [ ] No render-blocking 3rd party JS trên LCP path (GA load `afterInteractive`).

## 7. Off-page (post-launch, ngoài scope code)
- Đăng ký Google Business Profile, đồng bộ NAP.
- Submit 10–15 directory VN: bonbanh, otofun, chotot, foody, yellowpages…
- Outreach 5–10 site oto/xe điện local xin guest post.
- 3–5 video YouTube ngắn (lái thử, review) embed về landing.

## 8. Per-page SEO checklist (áp dụng mỗi route mới)
- [ ] Title ≤60 ký tự, chứa KW chính
- [ ] Meta desc 140–160 ký tự, có CTA + hotline
- [ ] 1 H1 chứa KW; H2/H3 chứa biến thể
- [ ] Canonical đúng
- [ ] ≥1 JSON-LD relevant
- [ ] Internal link tới ≥3 route khác (anchor có KW)
- [ ] Ảnh hero `priority`, alt mô tả + KW
- [ ] Sitemap entry + lastmod chuẩn
- [ ] Lighthouse SEO 100, Perf ≥95 mobile

## 9. KPI đo lường
| Tuần | KPI |
|------|-----|
| T+1 | Index đầy đủ trong Search Console, 0 lỗi crawl |
| T+2 | Rich results: AutoDealer + FAQ + Breadcrumb hiện trong GSC |
| T+4 | Top 30 cho `vinfast thái bình` |
| T+8 | Top 10 |
| T+12 | Top 3 |
| Liên tục | CTR SERP ≥ 8%, dwell time ≥ 90s, bounce ≤ 60% |
