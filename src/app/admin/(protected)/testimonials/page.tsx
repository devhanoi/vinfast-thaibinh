"use client";

import { TestimonialEntity, type TestimonialEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminTestimonialsPage() {
  return (
    <ResourceList<TestimonialEntityT>
      title="Testimonials"
      description="Review khách hàng hiển thị ở landing."
      endpoint="/api/admin/testimonials"
      schema={TestimonialEntity}
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
            t.isActive ? (
              <span className="text-brand">●</span>
            ) : (
              <span className="text-ink-muted">○</span>
            ),
        },
      ]}
    />
  );
}
