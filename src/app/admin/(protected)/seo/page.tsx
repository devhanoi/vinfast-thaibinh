"use client";

import { SeoEntity, SeoUpsertInput, type SeoEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminSeoPage() {
  return (
    <ResourceList<SeoEntityT>
      title="SEO settings"
      description="Title, meta description, canonical, OG image per page. Form dùng upsert theo pageKey."
      endpoint="/api/admin/seo"
      schema={SeoEntity}
      enableDelete={false}
      rowKey={(s) => s.pageKey}
      createForm={{
        inputSchema: SeoUpsertInput,
        method: "PUT",
        triggerLabel: "Thêm / cập nhật",
        submitLabel: "Lưu (upsert)",
        fields: [
          { name: "pageKey", label: "Page key", type: "text", required: true, placeholder: "home, xe-vf3, bang-gia..." },
          { name: "title", label: "Title (≤70)", type: "text", required: true },
          { name: "description", label: "Meta description (≤160)", type: "textarea", required: true, rows: 3 },
          { name: "ogImageUrl", label: "OG image URL", type: "url", placeholder: "/images/og-cover.jpg" },
          { name: "canonicalPath", label: "Canonical path", type: "text", defaultValue: "/" },
        ],
      }}
      columns={[
        { key: "pageKey", label: "Page", cell: (s) => <code className="text-xs">{s.pageKey}</code> },
        { key: "title", label: "Title", cell: (s) => <span className="font-semibold text-ink">{s.title}</span> },
        { key: "description", label: "Description", cell: (s) => <span className="line-clamp-2 text-ink-muted">{s.description}</span> },
        { key: "canonical", label: "Canonical", cell: (s) => <code className="text-xs text-ink-muted">{s.canonicalPath}</code> },
      ]}
    />
  );
}
