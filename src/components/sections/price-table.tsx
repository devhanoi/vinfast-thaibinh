import { CARS } from "@/content/cars";
import { formatVND } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function PriceTable() {
  return (
    <section id="bang-gia" className="section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Bảng giá VinFast Thái Bình</p>
          <h2 className="mt-3 h-section text-ink">
            Bảng giá xe VinFast tại Thái Bình – cập nhật tháng mới nhất
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Giá niêm yết áp dụng thống nhất toàn quốc. Liên hệ {SITE.hotline} để nhận báo giá lăn
            bánh chính xác cho từng huyện/thành phố và chương trình ưu đãi đang triển khai tại
            Thái Bình.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-paper-line text-sm">
              <thead className="bg-ink text-white">
                <tr className="text-left">
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Dòng xe</th>
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Phân khúc</th>
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Pin</th>
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Quãng đường</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold md:px-6">Giá niêm yết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line">
                {CARS.map((car) => (
                  <tr key={car.id} className="hover:bg-paper-soft">
                    <th scope="row" className="px-4 py-4 text-left font-semibold text-ink md:px-6">
                      {car.name}
                    </th>
                    <td className="px-4 py-4 text-ink-muted md:px-6">{car.segment}</td>
                    <td className="px-4 py-4 text-ink-muted md:px-6">{car.battery}</td>
                    <td className="px-4 py-4 text-ink-muted md:px-6">{car.rangeKm} km</td>
                    <td className="px-4 py-4 text-right font-semibold text-brand md:px-6">
                      {formatVND(car.priceFrom)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-muted">
          * Giá chưa bao gồm phí trước bạ, đăng ký, đăng kiểm. Xe điện đang được miễn phí trước bạ
          tới ngày 28/02/2027 theo Nghị định 10/2022/NĐ-CP.
        </p>
      </div>
    </section>
  );
}
