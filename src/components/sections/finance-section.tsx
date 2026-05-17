import { Check } from "lucide-react";

const STEPS = [
  {
    n: "01",
    t: "Chọn xe & nhận tư vấn",
    d: "Tư vấn viên tại Thái Bình lên cấu hình, tính tổng chi phí lăn bánh và ưu đãi đang chạy.",
  },
  {
    n: "02",
    t: "Nộp hồ sơ trả góp",
    d: "Chỉ cần CCCD + sổ hộ khẩu/đăng ký tạm trú. Duyệt qua VPBank, Techcombank, MB, Shinhan trong 24h.",
  },
  {
    n: "03",
    t: "Nhận xe 5–7 ngày",
    d: "Giao xe tại showroom hoặc tận nhà trong tỉnh. Hỗ trợ đăng ký biển 17 và bàn giao kỹ thuật.",
  },
];

const BENEFITS = [
  "Trả trước tối thiểu 20% giá trị xe",
  "Kỳ hạn linh hoạt 12–96 tháng",
  "Lãi suất ưu đãi từ 7,5%/năm cố định 12 tháng đầu",
  "Hỗ trợ chứng minh thu nhập, không cần thẩm định nhà",
];

export function FinanceSection() {
  return (
    <section id="tra-gop" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="eyebrow">Trả góp VinFast Thái Bình</p>
          <h2 className="mt-3 h-section text-ink">
            Sở hữu xe điện chỉ với 20% – góp linh hoạt tới 96 tháng
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            Ví dụ: VinFast VF 5 Plus giá 529 triệu, trả trước 20% (≈ 106 triệu), góp 60 tháng chỉ
            khoảng <strong className="text-ink">9.2 triệu/tháng</strong>. Đội ngũ tài chính tại
            showroom Thái Bình hỗ trợ chuẩn bị hồ sơ miễn phí.
          </p>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-ink-soft">
                <Check className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <ol className="space-y-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5 rounded-2xl border border-paper-line bg-white p-6 shadow-card">
              <span className="font-display text-3xl font-extrabold text-brand">{s.n}</span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{s.t}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
