import { Tag, Wallet, Home, Settings2 } from "lucide-react";

const BENEFITS = [
  {
    icon: Tag,
    title: "Báo giá tốt nhất tháng",
    desc: "Cam kết khớp giá mọi đại lý ủy quyền khu vực miền Bắc, công khai phí lăn bánh.",
  },
  {
    icon: Wallet,
    title: "Trả góp 80% – lãi suất ưu đãi",
    desc: "Hợp tác VPBank, Techcombank, MB Bank, Shinhan. Duyệt hồ sơ trong 24h.",
  },
  {
    icon: Home,
    title: "Lái thử tận nhà",
    desc: "Miễn phí trong bán kính 50km quanh TP. Thái Bình. Đặt lịch trước 4 giờ.",
  },
  {
    icon: Settings2,
    title: "Dịch vụ chuẩn toàn cầu",
    desc: "Xưởng sửa chữa thân vỏ, máy, sơn đạt chứng nhận VinFast Toàn Cầu.",
  },
];

export function BenefitsStrip() {
  return (
    <section className="bg-paper-soft section">
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <Icon className="text-brand" size={28} aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
