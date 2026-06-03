"use client";

import { SeoEntity, SeoUpsertInput, type SeoEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";
import { StoreForm } from "../../_components/store-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Cài đặt</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Thông tin showroom (NAP) + SEO meta cho từng page.
        </p>
      </header>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Thông tin showroom</h2>
            <p className="mt-1 text-sm text-ink-muted">
              NAP (Name · Address · Phone) — single record, dùng cho JSON-LD và footer.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <StoreForm />
        </div>
      </section>

      <section>
        <ResourceList<SeoEntityT>
          title="SEO settings"
          description="Title, meta description, canonical, OG image — config theo từng pageKey (home, xe-vf3, bang-gia…)."
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
      </section>
    </div>
  );
}
