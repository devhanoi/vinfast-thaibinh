import { MapPin } from "lucide-react";
import { CHARGING_STATIONS, TOTAL_STATIONS } from "@/content/charging-stations";
import type { CmsChargingStation } from "@/server/cms/types";

export function ChargingMapSection({
  districts,
  totalStations,
}: {
  districts?: { district: string; stations: CmsChargingStation[] }[];
  totalStations?: number;
}) {
  const items = districts ?? CHARGING_STATIONS.map((d, districtIndex) => ({
    district: d.district,
    stations: d.stations.map((s, stationIndex) => ({
      id: `${districtIndex}-${stationIndex}`,
      ...s,
      district: d.district,
      mapUrl: null,
      isActive: true,
      sortOrder: stationIndex + 1,
    })),
  }));
  return (
    <section id="tram-sac" className="section">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Hệ thống V-Green tại Thái Bình</p>
          <h2 className="mt-3 h-section text-ink">
            {totalStations ?? TOTAL_STATIONS} trạm sạc VinFast phủ kín TP. Thái Bình &amp; 7 huyện
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Sạc nhanh DC 30–60 kW cho ô tô và sạc AC 11 kW cho xe máy. Khách mua xe tại VinFast
            Thái Bình được tặng gói sạc V-Green miễn phí 24 tháng đầu.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3 self-start">
            {items.map((d) => (
              <details
                key={d.district}
                className="group rounded-2xl border border-paper-line bg-white shadow-card open:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    <MapPin size={18} className="text-brand" aria-hidden />
                    {d.district}
                  </span>
                  <span className="text-xs text-ink-muted">{d.stations.length} trạm</span>
                </summary>
                <ul className="space-y-2 border-t border-paper-line px-5 py-4 text-sm text-ink-soft">
                  {d.stations.map((s) => (
                    <li key={s.name}>
                      <strong className="text-ink">{s.name}</strong>
                      <span className="block text-xs text-ink-muted">{s.address}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
            <iframe
              title="Bản đồ trạm sạc VinFast Thái Bình"
              src="https://www.google.com/maps?q=VinFast+Thai+Binh&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full lg:h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
