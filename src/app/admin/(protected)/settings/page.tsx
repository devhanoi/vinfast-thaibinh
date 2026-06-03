"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api/fetcher";
import {
  SeoEntity,
  SeoUpsertInput,
  StoreSettingsEntity,
  type SeoEntityT,
  type StoreSettingsEntityT,
} from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Cài đặt</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Thông tin showroom (NAP) + SEO meta cho từng page.
        </p>
      </header>

      <StoreSection />
      <SeoSection />
    </div>
  );
}

// ─── Store section ──────────────────────────────────────────────────────────
function StoreSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "store"],
    queryFn: () =>
      fetchApi<StoreSettingsEntityT>("/api/admin/store", { schema: StoreSettingsEntity }),
  });

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Thông tin showroom</h2>
          <p className="mt-1 text-sm text-ink-muted">
            NAP (Name · Address · Phone) — single record, dùng cho JSON-LD và footer.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-paper-line bg-white p-6">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Đang tải…</p>
        ) : error ? (
          <p className="text-sm text-red-600">Lỗi: {(error as Error).message}</p>
        ) : !data ? (
          <p className="text-sm text-ink-muted">Chưa có dữ liệu.</p>
        ) : (
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <Row label="Tên" value={data.name} />
            <Row label="Tên pháp lý" value={data.legalName ?? "—"} />
            <Row label="URL" value={data.url} />
            <Row label="Hotline" value={data.hotline} />
            <Row label="Email" value={data.email} />
            <Row
              label="Địa chỉ"
              value={[data.address.street, data.address.ward, data.address.city, data.address.region]
                .filter(Boolean)
                .join(", ")}
            />
            <Row label="Geo" value={`${data.geo.latitude}, ${data.geo.longitude}`} />
            <Row label="Sales rep" value={`${data.salesRep.name} — ${data.salesRep.role ?? ""}`} />
            <Row label="Areas served" value={data.areaServed.join(", ")} />
            <Row label="Hours" value={`${data.hours.length} khung giờ`} />
          </dl>
        )}
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        Form chỉnh sửa NAP sẽ build sau. Hiện tại có thể cập nhật qua API:{" "}
        <code className="rounded bg-paper-soft px-1.5 py-0.5">PATCH /api/admin/store</code>.
      </p>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}

// ─── SEO section ────────────────────────────────────────────────────────────
function SeoSection() {
  return (
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
  );
}
