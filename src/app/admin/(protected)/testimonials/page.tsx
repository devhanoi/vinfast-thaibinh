"use client";

import {
  TestimonialCreateInput,
  TestimonialEntity,
  type TestimonialEntityT,
} from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminTestimonialsPage() {
  return (
    <ResourceList<TestimonialEntityT>
      title="Testimonials"
      description="Review khách hàng hiển thị ở landing."
      endpoint="/api/admin/testimonials"
      schema={TestimonialEntity}
      createForm={{
        inputSchema: TestimonialCreateInput,
        triggerLabel: "Thêm review",
        fields: [
          { name: "name", label: "Tên khách hàng", type: "text", required: true, placeholder: "Anh Phạm Tuấn" },
          { name: "vehicle", label: "Xe đang dùng", type: "text", placeholder: "VinFast VF 5 Plus" },
          { name: "location", label: "Khu vực", type: "text", placeholder: "TP. Thái Bình" },
          { name: "rating", label: "Số sao (1-5)", type: "number", defaultValue: 5 },
          { name: "content", label: "Nội dung review", type: "textarea", required: true, rows: 4 },
          { name: "sortOrder", label: "Thứ tự", type: "number", defaultValue: 0 },
          { name: "isActive", label: "Hiển thị", type: "checkbox", defaultValue: true },
        ],
      }}
      columns={[
        { key: "name", label: "Khách hàng", cell: (t) => <span className="font-semibold text-ink">{t.name}</span> },
        { key: "content", label: "Nội dung", cell: (t) => <span className="line-clamp-2 text-ink-muted">{t.content}</span> },
        { key: "rating", label: "Sao", cell: (t) => "★".repeat(t.rating) },
        { key: "vehicle", label: "Xe", cell: (t) => t.vehicle ?? "—" },
        { key: "location", label: "Khu vực", cell: (t) => t.location ?? "—" },
        {
          key: "active",
          label: "Active",
          cell: (t) =>
            t.isActive ? <span className="text-brand">●</span> : <span className="text-ink-muted">○</span>,
        },
      ]}
    />
  );
}
