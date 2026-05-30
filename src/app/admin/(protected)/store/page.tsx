"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api/fetcher";
import { StoreSettingsEntity, type StoreSettingsEntityT } from "@/lib/zod";

export default function AdminStorePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "store"],
    queryFn: () => fetchApi<StoreSettingsEntityT>("/api/admin/store", { schema: StoreSettingsEntity }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Thông tin showroom</h1>
      <p className="mt-1 text-sm text-ink-muted">
        NAP (Name · Address · Phone) — single record, dùng cho schema JSON-LD và footer.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-paper-line bg-white p-6">
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

      <p className="mt-4 text-xs text-ink-muted">
        Form chỉnh sửa NAP sẽ build sau. Hiện tại có thể cập nhật qua API:{" "}
        <code className="rounded bg-paper-soft px-1.5 py-0.5">PATCH /api/admin/store</code>.
      </p>
    </div>
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
