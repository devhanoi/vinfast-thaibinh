"use client";

import Image from "next/image";
import { HeroSlideEntity, type HeroSlideEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminHeroPage() {
  return (
    <ResourceList<HeroSlideEntityT>
      title="Hero slides"
      description="Các ảnh + tiêu đề xoay vòng ở phần đầu trang chủ."
      endpoint="/api/admin/hero"
      schema={HeroSlideEntity}
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
