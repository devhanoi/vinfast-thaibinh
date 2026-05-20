import { Wrench, ShieldCheck, PackageCheck, Headphones } from "lucide-react";

const ITEMS = [
  { icon: Wrench, title: "Sửa chữa thân vỏ – máy – sơn", desc: "Buồng sơn sấy hồng ngoại, đồng sơn xe va chạm theo tiêu chuẩn VinFast Toàn Cầu." },
  { icon: ShieldCheck, title: "Bảo dưỡng định kỳ", desc: "Theo lộ trình 5.000 / 10.000 / 20.000 km, áp dụng cho cả xe điện và xe máy điện." },
  { icon: PackageCheck, title: "Phụ tùng chính hãng", desc: "Kho phụ tùng VF 3 – VF 9 sẵn hàng, đặt trước qua hotline có thể giao trong 48 giờ." },
  { icon: Headphones, title: "Cứu hộ 24/7", desc: "Đội cứu hộ trong tỉnh, hỗ trợ kéo xe miễn phí trong 100 km đầu tiên." },
];

export function AftersalesSection() {
  return (
    <section id="dich-vu" className="bg-paper-soft section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Dịch vụ sau bán hàng</p>
          <h2 className="mt-3 h-section text-ink">Đồng hành cùng chủ xe VinFast tại Thái Bình</h2>
          <p className="mt-3 text-base text-ink-muted">
            Showroom VinFast Thái Bình tích hợp Sale – Service – Spareparts, đầu tư xưởng dịch vụ
            riêng cho dòng xe điện với hơn 60 kỹ thuật viên được hãng cấp chứng chỉ.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <Icon className="text-brand" size={28} aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
