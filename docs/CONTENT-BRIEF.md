# Content Brief — Trang `/`

> Outline chi tiết để agent implement copy + structure. Mọi câu chữ tiếng Việt, tone tin cậy – chuyên nghiệp – không hype. Số phải đúng (giá xe tham khảo cập nhật theo bảng VinFast tháng 5/2026).

## NAP cố định (cấm sửa)
- **Tên đại lý**: VinFast Thái Bình (Đại lý ủy quyền 3S — DragonGroup)
- **Hotline**: 0962.181.262 — Mr. Khánh
- **Email**: khanhvinfast17@gmail.com
- **Địa chỉ**: Đại Lộ Kỳ Đồng, KĐT Thái Bình Dragon City, P. Phú Xuân, TP. Thái Bình
- **Giờ mở cửa**: Thứ 2 – Thứ 7: 07:30 – 18:30 | Chủ nhật: 08:00 – 17:00
- **Geo**: lat `20.4503`, lng `106.3402` (xác minh lại bằng Google Maps trước khi commit)

## Cấu trúc trang (thứ tự render)

### 1. Header (sticky, nhẹ)
- Logo VinFast + tagline `Đại lý 3S Thái Bình`
- Nav: Bảng giá · Lái thử · Trả góp · Trạm sạc · Liên hệ
- CTA phụ: nút gọi `📞 0962.181.262` (mobile: full width sticky bottom)

### 2. Hero (LCP element)
- **H1**: `Đại lý VinFast Thái Bình – Showroom 3S chính hãng tại TP. Thái Bình`
- Subhead (~25 từ): nêu USP — 3S chính hãng, ưu đãi tháng, trả góp 80%, lái thử tận nhà, bảo hành chính hãng 7 năm/160.000km.
- 2 CTA: `Nhận báo giá ngay` (mở form) · `Đăng ký lái thử` (mở form khác).
- Hình: VF5 đứng tại showroom, `priority`, width 1280×720.
- Trust badges row: `Đại lý 3S` · `Bảo hành 7 năm` · `Trả góp 80%` · `Giao xe 7 ngày`.

### 3. Strip lợi ích (4 cột icon)
1. Báo giá tốt nhất tháng — cam kết match giá mọi đại lý.
2. Trả góp 80% lãi suất ưu đãi từ VPBank, Techcombank.
3. Lái thử tại nhà trong bán kính 50km.
4. Bảo dưỡng – sửa chữa 3S đạt chuẩn VinFast Toàn Cầu.

### 4. Bảng giá xe VinFast Thái Bình (tháng 5/2026)
> Section quan trọng cho Featured Snippet. Dùng `<table>` semantic + JSON-LD `Product`.

| Dòng xe | Phân khúc | Giá niêm yết (VNĐ) | Pin | Quãng đường |
|---|---|---|---|---|
| VinFast VF 3 | Mini SUV | 299.000.000 | 18.64 kWh | 210 km |
| VinFast VF 5 Plus | A-SUV | 529.000.000 | 37.23 kWh | 326 km |
| VinFast VF 6 | B-SUV | 675.000.000 | 59.6 kWh | 460 km |
| VinFast VF 7 | C-SUV | 850.000.000 | 75.3 kWh | 510 km |
| VinFast VF 8 Eco | D-SUV | 1.057.000.000 | 82 kWh | 471 km |
| VinFast VF 9 Eco | E-SUV | 1.443.000.000 | 92 kWh | 438 km |

Ghi chú nhỏ phía dưới: "Giá chưa bao gồm phí trước bạ, đăng ký, đăng kiểm. Liên hệ 0962.181.262 để được báo giá lăn bánh chính xác tại Thái Bình."

### 5. Card 6 dòng xe (grid 3×2)
Mỗi card: ảnh `next/image`, tên, giá từ, 3 highlight (pin, quãng đường, an toàn), 2 CTA (Báo giá / Lái thử). Anchor link tới `/bang-gia-xe-vinfast-thai-binh#vf-x` (Phase 2).

### 6. Xe dịch vụ (taxi điện) — 3 card
- Minio Green, Herio Green, Limo Green.
- USP: chuyên đội xe Xanh SM, hỗ trợ pháp lý + sạc miễn phí 2 năm.

### 7. Xe máy điện (collapse, ngắn gọn)
- 4 model: Evo200 Lite, Vento S, Theon S, Klara S2. Mỗi cái 1 dòng giá.

### 8. Trả góp & tài chính
- 3 bước: chọn xe → nộp hồ sơ → nhận xe 5–7 ngày.
- Ví dụ tính trả góp VF5: trả trước 20% (≈106 triệu), góp 60 tháng ≈ 9.2 triệu/tháng.
- Logo đối tác: VPBank, Techcombank, MB, Shinhan, Toyota Finance VinFast.

### 9. Lái thử tận nhà (form)
Form: Họ tên · SĐT · Dòng xe (select) · Địa chỉ · Khung giờ. Submit → POST `/api/lead`.

### 10. Trạm sạc tại Thái Bình
- Bản đồ Google Maps embed (lazy) đánh dấu 15 trạm.
- Danh sách 15 trạm (tên + địa chỉ ngắn), dạng `<details>` accordion theo huyện (TP. Thái Bình, Đông Hưng, Vũ Thư, Kiến Xương, Hưng Hà, Quỳnh Phụ, Thái Thụy, Tiền Hải).
- Link xuất sang trang VinFast chính hãng: `https://vinfastauto.com/vn_vi/danh-sach-tram-sac-vinfast-thai-binh`.

### 11. Dịch vụ sau bán hàng (3S)
- Sửa chữa thân vỏ, sơn, máy.
- Bảo dưỡng định kỳ theo lộ trình 5.000 / 10.000 / 20.000 km.
- Phụ tùng chính hãng, cứu hộ 24/7.
- Đặt lịch online.

### 12. Vì sao chọn VinFast Thái Bình (E-E-A-T)
- Ảnh + bio Mr. Khánh: 8+ năm bán xe, hơn 1.200 hợp đồng đã ký, top sales DragonGroup 2025.
- Logo "Đại lý 3S ủy quyền chính thức".
- Số liệu thật: `2.500+` khách hàng đã giao xe · `15` trạm sạc phục vụ · `60+` chuyên viên kỹ thuật được VinFast cấp chứng chỉ.

### 13. Testimonials (3–5 review thật)
Mỗi review: avatar (initial), tên, huyện, dòng xe, ngày, 4–5 sao, nội dung 2–3 dòng. **Bắt buộc Review schema** nếu đăng (otherwise bỏ schema để không vi phạm Google guideline).

### 14. FAQ (FAQPage schema)
1. **VinFast Thái Bình ở đâu?** Đại Lộ Kỳ Đồng, KĐT Thái Bình Dragon City, P. Phú Xuân, TP. Thái Bình.
2. **Hotline VinFast Thái Bình là số nào?** 0962.181.262 (Mr. Khánh).
3. **Tôi có thể lái thử VinFast tại nhà không?** Có, miễn phí trong bán kính 50km quanh TP. Thái Bình.
4. **Trả góp tối đa bao nhiêu %?** Tối đa 80% giá trị xe, kỳ hạn 8 năm, lãi suất từ 7.5%/năm.
5. **Giá xe VinFast tại Thái Bình có khác Hà Nội không?** Không, giá thống nhất toàn quốc; chi phí lăn bánh có khác do phí trước bạ địa phương.
6. **Thái Bình có bao nhiêu trạm sạc VinFast?** 15 trạm trải đều 8 huyện/thành phố.
7. **Bao lâu giao xe sau khi đặt cọc?** Trung bình 5–7 ngày với VF3, VF5, VF6; 10–14 ngày với VF8, VF9.
8. **Có nhận xe cũ trade-in không?** Có, định giá miễn phí mọi hãng xe.
9. **Bảo hành VinFast bao lâu?** 7 năm hoặc 160.000 km (pin bảo hành 8 năm/200.000 km, không giới hạn % suy giảm).
10. **Đại lý 3S là gì?** Sale – Service – Spareparts: bán xe, dịch vụ sửa chữa & bảo dưỡng, phụ tùng chính hãng — đều tại một địa điểm.

### 15. Bản đồ + footer liên hệ
- Google Maps embed (lazy).
- NAP đầy đủ, social (FB, Zalo, YouTube, TikTok), licence info, copyright.

### 16. Sticky mobile CTA bar
`📞 Gọi ngay` · `💬 Chat Zalo` · `📝 Báo giá`

## Style guide copy
- Số tiền: format `1.057.000.000 VNĐ` (dấu chấm phân cách nghìn).
- Số điện thoại: format `0962.181.262`.
- Tránh từ cấm Google Ads/SEO: "rẻ nhất", "cam kết 100%", "tốt nhất Việt Nam" mà không dẫn chứng.
- CTA verb mạnh: "Nhận báo giá", "Đặt lịch lái thử", "Gọi tư vấn miễn phí".

## Image asset checklist (đặt trong `public/images/`)
- `hero-vf5-showroom.jpg` (1280×720, <120KB AVIF)
- `og-cover.jpg` (1200×630)
- `logo-vinfast.svg`
- `logo-dragongroup.svg`
- `cars/vf3.jpg`, `vf5.jpg`, `vf6.jpg`, `vf7.jpg`, `vf8.jpg`, `vf9.jpg` (800×500)
- `service/{minio, herio, limo}.jpg`
- `bike/{evo200, vento-s, theon-s, klara-s2}.jpg`
- `team/khanh.jpg` (400×400)
- `bank/{vpbank, techcombank, mb, shinhan}.svg`

> Placeholder OK trong Phase 1 (dùng `https://placehold.co/…` hoặc ảnh stock chính hãng VinFast), nhưng đánh dấu TODO để thay ảnh thật trước khi launch.
