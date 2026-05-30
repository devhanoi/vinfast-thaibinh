"use client";

import { SeoEntity, type SeoEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminSeoPage() {
  return (
    <ResourceList<SeoEntityT>
      title="SEO settings"
      description="Title, meta description, canonical, OG image per page."
      endpoint="/api/admin/seo"
      schema={SeoEntity}
      enableDelete={false}
      rowKey={(s) => s.pageKey}
      columns={[
        { key: "pageKey", label: "Page", cell: (s) => <code className="text-xs">{s.pageKey}</code> },
        { key: "title", label: "Title", cell: (s) => <span className="font-semibold text-ink">{s.title}</span> },
        { key: "description", label: "Description", cell: (s) => <span className="line-clamp-2 text-ink-muted">{s.description}</span> },
        { key: "canonical", label: "Canonical", cell: (s) => <code className="text-xs text-ink-muted">{s.canonicalPath}</code> },
      ]}
    />
  );
}
