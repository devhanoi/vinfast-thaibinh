"use client";

import Image from "next/image";
import { HeroSlideCreateInput, HeroSlideEntity, type HeroSlideEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminHeroPage() {
  return (
    <ResourceList<HeroSlideEntityT>
      title="Hero slides"
      description="Các ảnh + tiêu đề xoay vòng ở phần đầu trang chủ."
      endpoint="/api/admin/hero"
      schema={HeroSlideEntity}
      createForm={{
        inputSchema: HeroSlideCreateInput,
        triggerLabel: "Thêm slide",
        fields: [
          { name: "title", label: "Tiêu đề", type: "text", required: true, placeholder: "VinFast VF8 thế hệ mới" },
          { name: "subtitle", label: "Phụ đề", type: "text", placeholder: "SUV điện cao cấp — sẵn sàng giao xe" },
          {
            name: "imageUrl",
            label: "Ảnh slide",
            type: "image",
            required: true,
            uploadResource: "hero",
            uploadSlug: "slide",
            hint: "Tỷ lệ tốt nhất 21:9 (1920×820+). JPG/PNG/WebP/AVIF, max 10MB.",
          },
          { name: "imageAlt", label: "Alt text", type: "text", required: true },
          { name: "ctaLabel", label: "Nút CTA", type: "text", defaultValue: "Nhận báo giá ngay" },
          { name: "ctaHref", label: "CTA link", type: "text", defaultValue: "#bao-gia" },
          { name: "sortOrder", label: "Thứ tự", type: "number", defaultValue: 0 },
          { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
        ],
      }}
      editForm={{}}
      columns={[
        {
          key: "preview",
          label: "Ảnh",
          cell: (s) => (
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <Image src={s.imageUrl} alt={s.imageAlt} fill sizes="64px" className="object-cover" />
            </div>
          ),
        },
        { key: "title", label: "Tiêu đề", cell: (s) => <span className="font-semibold text-ink">{s.title}</span> },
        { key: "subtitle", label: "Phụ đề", cell: (s) => <span className="line-clamp-1 text-ink-muted">{s.subtitle}</span> },
        { key: "cta", label: "CTA", cell: (s) => `${s.ctaLabel} → ${s.ctaHref}` },
        { key: "sortOrder", label: "Thứ tự", cell: (s) => s.sortOrder },
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
