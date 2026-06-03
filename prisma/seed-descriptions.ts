/**
 * Mô tả markdown cho từng sản phẩm. Seed sẽ map theo slug.
 * Render: marked() trên server, dangerouslySetInnerHTML trên trang /xe/[slug].
 *
 * Format: paragraph + **bold** + ### heading + - list + > callout.
 * Tránh HTML thô vì sanitize chưa wire.
 */
export const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "vf-3": `**VinFast VF 3** là mẫu mini SUV đô thị nhỏ gọn, phong cách trẻ trung, lý tưởng cho khách hàng cá nhân tại Thái Bình tìm chiếc xe điện đầu tiên. Kích thước **3.114 × 1.598 × 1.622 mm** giúp len lỏi đường phố đông đúc trong nội thành dễ dàng, đậu xe nhanh tại các trung tâm thương mại Vincom, Trần Hưng Đạo.

### Trang bị nổi bật
- Pin **18.64 kWh** vận hành **210 km** mỗi lần sạc — đủ đi lại 4–5 ngày làm việc
- Sạc nhanh **DC 36 phút** đầy 70%, sạc AC tại nhà qua đêm
- **4 chỗ ngồi rộng rãi**, cốp 285L, ghế sau gập 60:40
- 4 phiên bản màu: đỏ, trắng, vàng, xanh dương

### Vì sao chọn VF 3 tại Thái Bình
- Giá khởi điểm **chỉ 299 triệu** — cạnh tranh với xe xăng cùng phân khúc
- **Miễn phí trước bạ** đến hết 28/02/2027
- **Sạc 0 đồng** tại trạm V-Green đến 30/06/2027
- Bảo hành chính hãng **7 năm / 160.000 km**, pin **8 năm / 200.000 km**
- Trả góp 80% lãi suất ưu đãi qua VPBank, Techcombank, MB Bank, Shinhan Finance`,

  "vf-5": `**VinFast VF 5 Plus** là A-SUV gia đình nhỏ gọn, phù hợp với hộ gia đình 4–5 người tại Thái Bình. Thiết kế năng động, nội thất hiện đại với màn hình giải trí **8 inch** + cụm đồng hồ kỹ thuật số.

### Trang bị nổi bật
- Pin **37.23 kWh** quãng đường **326 km** một lần sạc
- Motor **100 kW** mô-men xoắn 135 Nm, tăng tốc 0–100 km/h trong **9.9 giây**
- 5 chỗ ngồi rộng nhất phân khúc, cốp 330L (mở rộng 1.000L khi gập ghế)
- **ADAS cơ bản**: cruise control, cảnh báo va chạm, phanh khẩn cấp tự động
- Phanh đĩa cả 4 bánh — an toàn vượt trội so với xe xăng giá tương đương

### Vì sao chọn VF 5 Plus
- Phân khúc **A-SUV gia đình** sôi động nhất Việt Nam hiện nay
- Giá khởi điểm **529 triệu**, miễn trước bạ tiết kiệm thêm ~50 triệu
- 8 màu xe: trắng, đen, đỏ, xám, vàng, xanh dương, xanh rêu, bạc
- Bảo hành **7 năm / 160.000 km** + cứu hộ 24/7 trong tỉnh
- Trả góp lên tới 80%, kỳ hạn 96 tháng`,

  "vf-6": `**VinFast VF 6** là B-SUV năng động dành cho khách hàng trẻ thành đạt, vừa làm việc vừa cần xe gia đình cho cuối tuần. Phong cách thiết kế GT trẻ trung, mạnh mẽ với đèn pha LED hình mũi tên đặc trưng VinFast.

### Trang bị nổi bật
- Pin **59.6 kWh** quãng đường **460 km** mỗi lần sạc
- Motor **130 kW**, mô-men xoắn **250 Nm**, AWD tùy chọn
- Màn hình giải trí **12.9 inch** xoay được, cụm đồng hồ HUD trên kính lái
- **ADAS Level 2**: giữ làn, cruise adaptive, đỗ xe tự động
- 6 túi khí, ABS, EBD, ESC, đèn LED tự động — 5 sao an toàn ASEAN NCAP

### Vì sao chọn VF 6
- Phân khúc **B-SUV** dùng đa năng — đi làm, đi chơi, chở gia đình
- Giá **675 triệu** với cấu hình Eco, **735 triệu** Plus
- Sạc DC nhanh, 10–70% trong 24 phút
- Trả góp 80%, lãi suất ưu đãi từ **7.5%/năm**
- 5 màu xe: đen, đỏ, xám, xanh rêu, trắng`,

  "vf-7": `**VinFast VF 7** là C-SUV cao cấp với ngôn ngữ thiết kế GT thể thao, dành cho khách hàng yêu thích phong cách và hiệu năng. Tỷ lệ thân xe thấp và rộng, mui xe dài tạo cảm giác siêu xe.

### Trang bị nổi bật
- Pin **75.3 kWh** quãng đường **510 km** mỗi lần sạc
- Motor công suất lớn, **AWD tùy chọn** (2 motor), tăng tốc 0–100 km/h **5.8 giây** (bản AWD)
- Cabin yên tĩnh với cách âm hai lớp, ghế da Nappa, hệ thống âm thanh **8 loa**
- Mâm hợp kim **20 inch** thiết kế thể thao, phanh Brembo (option)
- **ADAS Level 2+**: giữ làn nâng cao, đổi làn tự động, lái rảnh tay trên cao tốc

### Vì sao chọn VF 7
- Đối thủ trực tiếp Toyota Corolla Cross, Honda HR-V phiên bản điện
- Giá khởi điểm **850 triệu** — rẻ hơn xe xăng cùng phân khúc ~150 triệu
- 4 màu xe: đen, đỏ, xám, xanh rêu
- Bảo hành **7 năm / 160.000 km**
- Trade-in xe cũ giá tốt — định giá miễn phí mọi hãng`,

  "vf-8": `**VinFast VF 8 Eco** là D-SUV 5 chỗ cao cấp, đối thủ của Tesla Model Y, Hyundai Ioniq 5. Thiết kế bởi **Pininfarina** danh tiếng — cabin sang trọng, vật liệu cao cấp, không gian rộng rãi cho gia đình.

### Trang bị nổi bật
- Pin **82 kWh** quãng đường **471 km** mỗi lần sạc (chuẩn WLTP)
- Hai motor AWD **300 kW** (~408 mã lực), tăng tốc 0–100 km/h **5.5 giây**
- **Ghế da Nappa**, ghế trước massage 12 hướng, làm mát + sưởi ấm
- Màn hình giải trí **15.6 inch** + cụm đồng hồ kỹ thuật số 10 inch
- **Smart Services**: cập nhật phần mềm OTA, kết nối ứng dụng VinFast App
- **ADAS Level 2+** với 24 cảm biến (camera + radar + ultrasonic)

### Vì sao chọn VF 8 Eco
- D-SUV **AWD 300 kW** với giá khởi điểm **1.057 tỷ** — rẻ hơn Model Y ~500 triệu
- 5 màu xe: trắng, đen-vàng, đỏ, xám, xanh rêu
- Bảo hành **7 năm / 160.000 km** + pin **8 năm / 200.000 km**, không giới hạn % suy giảm
- Cứu hộ 24/7 trong tỉnh Thái Bình + 100 km miễn phí
- Trả góp 80% qua VPBank, MB Bank, Shinhan Finance`,

  "vf-9": `**VinFast VF 9 Eco** là E-SUV 7 chỗ flagship của VinFast, đối thủ trực tiếp BMW iX, Mercedes EQS SUV. Kích thước **5.118 × 2.000 × 1.721 mm** — không gian rộng rãi 3 hàng ghế thoải mái cho gia đình 6–7 thành viên.

### Trang bị nổi bật
- Pin **92 kWh** quãng đường **438 km** (chuẩn EPA, kéo theo 7 người)
- Hai motor AWD **300 kW**, tăng tốc 0–100 km/h **6.5 giây**
- **7 chỗ 3 hàng ghế** — hàng 2 ghế thuyền có thể gập 60:40, hàng 3 cho người lớn
- **Khoang cabin sang trọng**: ghế da Nappa cả 7 chỗ, trần kính panoramic, đèn ambient 64 màu
- Hệ thống âm thanh **13 loa** premium, sạc không dây, USB-C 6 cổng
- **ADAS Level 2+**: giữ làn, đổi làn, hỗ trợ đỗ xe tự động

### Vì sao chọn VF 9 Eco
- E-SUV 7 chỗ duy nhất phân khúc giá dưới 2 tỷ tại Việt Nam
- Giá khởi điểm **1.443 tỷ** Eco, **1.499 tỷ** Plus
- 5 màu xe: trắng, đen, đỏ, xám, xanh rêu
- Bảo hành **7 năm / 160.000 km**, pin **8 năm / 200.000 km**
- Phù hợp doanh nhân, gia đình lớn, dịch vụ đưa đón cao cấp`,

  // Service Green
  "minio-green": `**VinFast Minio Green** là xe điện 4 chỗ chuyên phục vụ đội taxi Xanh SM. Kích thước nhỏ gọn, vận hành tiết kiệm, chi phí thấp — phù hợp tài xế kinh doanh độc lập.

- Pin tối ưu cho **đi lại nội thành** 200–250 km/lần sạc
- Hỗ trợ pháp lý: đăng ký kinh doanh, biển số vàng, đăng kiểm
- **Sạc miễn phí 2 năm** đầu tại trạm V-Green
- Giá khởi điểm **269 triệu** — hoàn vốn nhanh sau 12–18 tháng chạy đều`,

  "herio-green": `**VinFast Herio Green** là xe điện 5 chỗ tối ưu chi phí vận hành cho đội taxi và dịch vụ. Trang bị tiện nghi cơ bản, khoang hành khách rộng, độ bền cao chạy 200.000 km/năm không xuống cấp.

- Pin **40 kWh**, quãng đường **300+ km** mỗi lần sạc
- Hỗ trợ tài xế: tư vấn pháp lý + hợp đồng thuê Xanh SM
- **Sạc miễn phí 2 năm** + bảo dưỡng định kỳ giá đại lý
- Giá khởi điểm **499 triệu**, trả góp 80% kỳ hạn 60 tháng`,

  "limo-green": `**VinFast Limo Green** là MPV 7 chỗ chuyên dịch vụ đưa đón cao cấp — xe sân bay, du lịch, lễ tân khách sạn. Cabin rộng rãi, ghế VIP hàng 2, không gian hành lý lớn.

- Pin **75 kWh**, quãng đường **420 km** mỗi lần sạc
- 7 chỗ rộng rãi, ghế da, điều hòa 3 vùng
- Tích hợp gói **Xanh SM Limo** với hoa hồng cao cho tài xế
- Giá khởi điểm **749 triệu**, hỗ trợ trả góp linh hoạt`,
};
