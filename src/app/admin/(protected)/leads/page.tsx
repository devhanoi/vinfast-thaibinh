"use client";

import { LeadEntity, type LeadEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminLeadsPage() {
  return (
    <ResourceList<LeadEntityT>
      title="Lead khách hàng"
      description="Form đăng ký nhận báo giá / lái thử từ landing page."
      endpoint="/api/admin/leads"
      schema={LeadEntity}
      enableDelete={false}
      columns={[
        { key: "name", label: "Họ tên", cell: (l) => <span className="font-semibold text-ink">{l.name}</span> },
        { key: "phone", label: "SĐT", cell: (l) => <a href={`tel:${l.phone}`} className="text-brand hover:underline">{l.phone}</a> },
        { key: "model", label: "Dòng xe", cell: (l) => l.model },
        { key: "address", label: "Địa chỉ", cell: (l) => <span className="line-clamp-1 text-ink-muted">{l.address ?? "—"}</span> },
        {
          key: "status",
          label: "Trạng thái",
          cell: (l) => {
            const color = {
              new: "bg-blue-100 text-blue-700",
              contacted: "bg-yellow-100 text-yellow-700",
              won: "bg-brand/10 text-brand",
              lost: "bg-red-100 text-red-700",
            }[l.status];
            return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{l.status}</span>;
          },
        },
        { key: "createdAt", label: "Thời gian", cell: (l) => new Date(l.createdAt).toLocaleString("vi-VN") },
      ]}
    />
  );
}
