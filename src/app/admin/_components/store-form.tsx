"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save } from "lucide-react";
import { fetchApi } from "@/lib/api/fetcher";
import {
  StoreSettingsEntity,
  StoreSettingsUpdateInput,
  type StoreSettingsEntityT,
} from "@/lib/zod";

export function StoreForm() {
  const qc = useQueryClient();
  const queryKey = ["admin", "store"] as const;
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchApi<StoreSettingsEntityT>("/api/admin/store", { schema: StoreSettingsEntity }),
  });

  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const save = useMutation({
    mutationFn: (body: Partial<StoreSettingsEntityT>) =>
      fetchApi<StoreSettingsEntityT>("/api/admin/store", {
        method: "PATCH",
        body,
        schema: StoreSettingsEntity,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      setMsg({ kind: "ok", text: "Đã lưu thay đổi" });
    },
    onError: (e) => setMsg({ kind: "err", text: (e as Error).message }),
  });

  if (isLoading) return <p className="text-sm text-ink-muted">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-600">Lỗi: {(error as Error).message}</p>;
  if (!data) return <p className="text-sm text-ink-muted">Chưa có dữ liệu.</p>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: str(fd, "name"),
      legalName: optStr(fd, "legalName"),
      url: str(fd, "url"),
      hotline: str(fd, "hotline"),
      hotlineE164: str(fd, "hotlineE164"),
      email: str(fd, "email"),
      address: {
        street: str(fd, "address.street"),
        ward: optStr(fd, "address.ward"),
        city: str(fd, "address.city"),
        region: str(fd, "address.region"),
        postalCode: optStr(fd, "address.postalCode"),
        country: str(fd, "address.country") || "VN",
      },
      geo: {
        latitude: Number(fd.get("geo.latitude") ?? 0),
        longitude: Number(fd.get("geo.longitude") ?? 0),
      },
      social: {
        facebook: optStr(fd, "social.facebook"),
        zalo: optStr(fd, "social.zalo"),
        youtube: optStr(fd, "social.youtube"),
        tiktok: optStr(fd, "social.tiktok"),
      },
      salesRep: {
        name: str(fd, "salesRep.name"),
        role: optStr(fd, "salesRep.role"),
        experience: optStr(fd, "salesRep.experience"),
      },
      areaServed: splitLines(fd.get("areaServed")),
      hours: data?.hours ?? [],
    };

    try {
      const parsed = StoreSettingsUpdateInput.parse(raw);
      await save.mutateAsync(parsed);
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-paper-line bg-white p-6"
    >
      {msg && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            msg.kind === "ok"
              ? "bg-brand/10 text-brand"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <Group title="Thông tin chung">
        <Field name="name" label="Tên hiển thị" defaultValue={data.name} required />
        <Field name="legalName" label="Tên pháp lý" defaultValue={data.legalName ?? ""} />
        <Field name="url" label="URL website" type="url" defaultValue={data.url} required />
        <Field name="email" label="Email" type="email" defaultValue={data.email} required />
        <Field name="hotline" label="Hotline (hiển thị)" defaultValue={data.hotline} required hint="VD: 0962.181.262" />
        <Field name="hotlineE164" label="Hotline E.164 (tel:)" defaultValue={data.hotlineE164} required hint="VD: +84962181262" />
      </Group>

      <Group title="Địa chỉ">
        <Field name="address.street" label="Đường" defaultValue={data.address.street} required full />
        <Field name="address.ward" label="Phường / Xã" defaultValue={data.address.ward ?? ""} />
        <Field name="address.city" label="Thành phố / Huyện" defaultValue={data.address.city} required />
        <Field name="address.region" label="Tỉnh" defaultValue={data.address.region} required />
        <Field name="address.postalCode" label="Postal code" defaultValue={data.address.postalCode ?? ""} />
        <Field name="address.country" label="Country (ISO)" defaultValue={data.address.country} maxLength={2} />
      </Group>

      <Group title="Tọa độ (Google Maps)">
        <Field name="geo.latitude" label="Latitude" type="number" step="0.000001" defaultValue={String(data.geo.latitude)} required />
        <Field name="geo.longitude" label="Longitude" type="number" step="0.000001" defaultValue={String(data.geo.longitude)} required />
      </Group>

      <Group title="Sales rep (E-E-A-T)">
        <Field name="salesRep.name" label="Họ tên" defaultValue={data.salesRep.name} required />
        <Field name="salesRep.role" label="Chức vụ" defaultValue={data.salesRep.role ?? ""} />
        <Field name="salesRep.experience" label="Kinh nghiệm / mô tả ngắn" defaultValue={data.salesRep.experience ?? ""} full />
      </Group>

      <Group title="Mạng xã hội">
        <Field name="social.facebook" label="Facebook URL" type="url" defaultValue={data.social.facebook ?? ""} />
        <Field name="social.zalo" label="Zalo URL" type="url" defaultValue={data.social.zalo ?? ""} />
        <Field name="social.youtube" label="YouTube URL" type="url" defaultValue={data.social.youtube ?? ""} />
        <Field name="social.tiktok" label="TikTok URL" type="url" defaultValue={data.social.tiktok ?? ""} />
      </Group>

      <Group title="Phạm vi phục vụ" cols={1}>
        <label className="block text-sm font-semibold text-ink-soft md:col-span-2">
          <span>Areas served (mỗi tỉnh / khu vực 1 dòng)</span>
          <textarea
            name="areaServed"
            rows={4}
            defaultValue={(data.areaServed ?? []).join("\n")}
            className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </label>
      </Group>

      <div className="flex items-center gap-3 border-t border-paper-line pt-5">
        <button
          type="submit"
          disabled={save.isPending}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2 text-sm disabled:opacity-60"
        >
          <Save size={16} /> {save.isPending ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        <p className="text-xs text-ink-muted">
          Hours array (giờ mở cửa) hiện edit qua API:{" "}
          <code className="rounded bg-paper-soft px-1.5 py-0.5">PATCH /api/admin/store</code>.
        </p>
      </div>
    </form>
  );
}

function Group({
  title,
  children,
  cols = 2,
}: {
  title: string;
  children: React.ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <fieldset>
      <legend className="font-display text-base font-semibold text-ink">{title}</legend>
      <div className={`mt-3 grid gap-4 ${cols === 2 ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {children}
      </div>
    </fieldset>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  hint,
  full,
  step,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  full?: boolean;
  step?: string;
  maxLength?: number;
}) {
  return (
    <label className={`block text-sm font-semibold text-ink-soft ${full ? "md:col-span-2" : ""}`}>
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <span className="mt-0.5 block text-xs font-normal text-ink-muted">{hint}</span>}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        step={step}
        maxLength={maxLength}
        className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function optStr(fd: FormData, key: string): string | undefined {
  const v = str(fd, key);
  return v.length > 0 ? v : undefined;
}

function splitLines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
