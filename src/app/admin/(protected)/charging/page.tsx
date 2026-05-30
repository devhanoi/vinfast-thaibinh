"use client";

import {
  ChargingStationCreateInput,
  ChargingStationEntity,
  type ChargingStationEntityT,
} from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminChargingPage() {
  return (
    <ResourceList<ChargingStationEntityT>
      title="Trạm sạc"
      description="Danh sách trạm sạc VinFast tại Thái Bình hiển thị trên bản đồ."
      endpoint="/api/admin/charging"
      schema={ChargingStationEntity}
      createForm={{
        inputSchema: ChargingStationCreateInput,
        triggerLabel: "Thêm trạm",
        fields: [
          { name: "name", label: "Tên trạm", type: "text", required: true, placeholder: "Trạm sạc Vincom Thái Bình" },
          { name: "district", label: "Huyện", type: "text", required: true, placeholder: "TP. Thái Bình" },
          { name: "address", label: "Địa chỉ", type: "textarea", required: true, rows: 2 },
          { name: "mapUrl", label: "Google Maps URL", type: "url", placeholder: "https://maps.google.com/..." },
          { name: "lat", label: "Latitude", type: "number", placeholder: "20.4503" },
          { name: "lng", label: "Longitude", type: "number", placeholder: "106.3402" },
          { name: "sortOrder", label: "Thứ tự", type: "number", defaultValue: 0 },
          { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
        ],
      }}
      columns={[
        { key: "name", label: "Tên trạm", cell: (s) => <span className="font-semibold text-ink">{s.name}</span> },
        { key: "district", label: "Huyện", cell: (s) => s.district },
        { key: "address", label: "Địa chỉ", cell: (s) => <span className="line-clamp-1 text-ink-muted">{s.address}</span> },
        { key: "geo", label: "Geo", cell: (s) => (s.lat && s.lng ? `${s.lat.toFixed(3)}, ${s.lng.toFixed(3)}` : "—") },
        {
          key: "active",
          label: "Active",
          cell: (s) =>
            s.isActive ? <span className="text-brand">●</span> : <span className="text-ink-muted">○</span>,
        },
      ]}
    />
  );
}
