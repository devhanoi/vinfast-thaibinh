"use client";

import { ChargingStationEntity, type ChargingStationEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminChargingPage() {
  return (
    <ResourceList<ChargingStationEntityT>
      title="Trạm sạc"
      description="Danh sách trạm sạc VinFast tại Thái Bình hiển thị trên bản đồ."
      endpoint="/api/admin/charging"
      schema={ChargingStationEntity}
      columns={[
        { key: "name", label: "Tên trạm", cell: (s) => <span className="font-semibold text-ink">{s.name}</span> },
        { key: "district", label: "Huyện", cell: (s) => s.district },
        { key: "address", label: "Địa chỉ", cell: (s) => <span className="line-clamp-1 text-ink-muted">{s.address}</span> },
        { key: "geo", label: "Geo", cell: (s) => (s.lat && s.lng ? `${s.lat.toFixed(3)}, ${s.lng.toFixed(3)}` : "—") },
        {
          key: "active",
          label: "Active",
          cell: (s) =>
            s.isActive ? (
              <span className="text-brand">●</span>
            ) : (
              <span className="text-ink-muted">○</span>
            ),
        },
      ]}
    />
  );
}
