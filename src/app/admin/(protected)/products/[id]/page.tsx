"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Star, Trash2, X } from "lucide-react";
import { fetchApi } from "@/lib/api/fetcher";
import { formatVND } from "@/lib/utils";
import {
  ProductEntity,
  ProductImageCreateInput,
  ProductUpdateInput,
  type ProductImageEntityT,
  type ProductCategoryT,
  type ProductEntityT,
} from "@/lib/zod";
import { useProduct, useUpdateProduct } from "@/lib/api-hooks/use-products";
import { ImageUploader } from "../../../_components/image-uploader";
import { RichEditor } from "../../../_components/rich-editor";

type PageProps = { params: Promise<{ id: string }> };

export default function AdminProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <p className="text-sm text-ink-muted">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-600">{(error as Error).message}</p>;
  if (!product) return <p className="text-sm text-ink-muted">Không tìm thấy sản phẩm.</p>;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          <ChevronLeft size={16} /> Tất cả sản phẩm
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">{product.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          <code className="rounded bg-paper-soft px-1.5 py-0.5 text-xs">{product.slug}</code>{" "}
          · {product.category} · Từ <strong>{formatVND(product.priceFrom)}</strong>
        </p>
      </div>

      <ProductInfoForm product={product} />

      <ImagesPanel productId={id} productSlug={product.slug} images={product.images} />
    </div>
  );
}

function ProductInfoForm({ product }: { product: ProductEntityT }) {
  const update = useUpdateProduct(product.id);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const raw = {
      slug: String(fd.get("slug") ?? ""),
      name: String(fd.get("name") ?? ""),
      category: fd.get("category") as ProductCategoryT,
      segment: stringOrNull(fd.get("segment")),
      tagline: stringOrNull(fd.get("tagline")),
      description: stringOrNull(fd.get("description")),
      priceFrom: Number(fd.get("priceFrom") ?? 0),
      battery: stringOrNull(fd.get("battery")),
      rangeKm: fd.get("rangeKm") ? Number(fd.get("rangeKm")) : null,
      rangeText: stringOrNull(fd.get("rangeText")),
      status: fd.get("status") as "active" | "draft" | "archived",
      sortOrder: Number(fd.get("sortOrder") ?? 0),
      highlights: String(fd.get("highlights") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      const parsed = ProductUpdateInput.parse(raw);
      await update.mutateAsync(parsed);
      setMsg("Đã lưu");
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-paper-line bg-white p-5"
    >
      <h2 className="font-display text-lg font-bold text-ink">Thông tin sản phẩm</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <FormField label="Tên xe" name="name" defaultValue={product.name} required />
        <FormField label="Slug" name="slug" defaultValue={product.slug} required />
        <FormSelect
          label="Phân loại"
          name="category"
          defaultValue={product.category}
          options={[
            { value: "car", label: "Xe ô tô" },
            { value: "service_car", label: "Xe dịch vụ" },
            { value: "bike", label: "Xe máy điện" },
          ]}
        />
        <FormSelect
          label="Trạng thái"
          name="status"
          defaultValue={product.status}
          options={[
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <FormField label="Phân khúc" name="segment" defaultValue={product.segment ?? ""} />
        <FormField label="Tagline" name="tagline" defaultValue={product.tagline ?? ""} />
        <FormField
          label="Giá từ (VNĐ)"
          name="priceFrom"
          type="number"
          defaultValue={String(product.priceFrom)}
          required
        />
        <FormField label="Pin" name="battery" defaultValue={product.battery ?? ""} />
        <FormField
          label="Quãng đường (km)"
          name="rangeKm"
          type="number"
          defaultValue={product.rangeKm ? String(product.rangeKm) : ""}
        />
        <FormField
          label="Range text (xe máy)"
          name="rangeText"
          defaultValue={product.rangeText ?? ""}
        />
        <FormField
          label="Thứ tự"
          name="sortOrder"
          type="number"
          defaultValue={String(product.sortOrder)}
        />
      </div>
      <DescriptionField defaultValue={product.description ?? ""} />
      <label className="mt-4 block text-sm font-semibold text-ink-soft">
        Highlights (mỗi dòng 1 ý)
        <textarea
          name="highlights"
          rows={4}
          defaultValue={product.highlights.join("\n")}
          className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
      </label>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        {msg && <span className="text-sm text-ink-muted">{msg}</span>}
      </div>
    </form>
  );
}

function ImagesPanel({
  productId,
  productSlug,
  images,
}: {
  productId: string;
  productSlug: string;
  images: ProductImageEntityT[];
}) {
  const qc = useQueryClient();
  const queryKey = ["admin", "/api/admin/products", productId];
  const allColors = Array.from(new Set(images.map((i) => i.color).filter(Boolean))) as string[];
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const visible = activeColor ? images.filter((i) => i.color === activeColor) : images;

  const setPrimary = useMutation({
    mutationFn: (imageId: string) =>
      fetchApi(`/api/admin/products/${productId}/images/${imageId}`, {
        method: "PATCH",
        body: { isPrimary: true },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (imageId: string) =>
      fetchApi(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <div className="rounded-2xl border border-paper-line bg-white p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Ảnh sản phẩm <span className="text-ink-muted">({images.length})</span>
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Mỗi xe có nhiều ảnh theo màu + góc chụp. Ảnh primary hiển thị làm chính ở landing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="btn-primary px-4 py-2 text-sm"
        >
          {adding ? <X size={16} /> : <Plus size={16} />}
          {adding ? "Đóng" : "Thêm ảnh"}
        </button>
      </div>

      {allColors.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Lọc theo màu:
          </span>
          <button
            type="button"
            onClick={() => setActiveColor(null)}
            className={chip(activeColor === null)}
          >
            Tất cả ({images.length})
          </button>
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveColor(c)}
              className={chip(activeColor === c)}
            >
              {c} ({images.filter((i) => i.color === c).length})
            </button>
          ))}
        </div>
      )}

      {adding && (
        <div className="mt-5">
          <AddImageForm
            productId={productId}
            productSlug={productSlug}
            onDone={() => setAdding(false)}
          />
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">Chưa có ảnh nào.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-paper-line bg-paper-soft"
            >
              <div className="relative aspect-[4/3] bg-paper-soft">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                  unoptimized={img.url.startsWith("http")}
                />
                {img.isPrimary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white shadow">
                    <Star size={12} fill="currentColor" /> Primary
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3 text-xs">
                <p className="text-ink-muted">
                  <span className="font-semibold text-ink">Màu:</span> {img.color ?? "—"}
                </p>
                <p className="text-ink-muted">
                  <span className="font-semibold text-ink">Góc:</span> {img.angle ?? "—"}
                </p>
                <p className="line-clamp-2 text-ink-muted">{img.alt}</p>
                <div className="flex items-center gap-2 pt-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary.mutate(img.id)}
                      disabled={setPrimary.isPending}
                      className="flex-1 rounded border border-paper-line px-2 py-1 text-xs font-medium text-ink hover:border-brand hover:text-brand disabled:opacity-40"
                    >
                      Đặt làm chính
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Xóa ảnh này?")) remove.mutate(img.id);
                    }}
                    disabled={remove.isPending}
                    className="rounded border border-paper-line p-1.5 text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                    aria-label="Xóa ảnh"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddImageForm({
  productId,
  productSlug,
  onDone,
}: {
  productId: string;
  productSlug: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const queryKey = ["admin", "/api/admin/products", productId];
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      if (!url) throw new Error("Vui lòng upload ảnh trước");
      const input = ProductImageCreateInput.parse({
        url,
        alt: String(fd.get("alt") ?? ""),
        color: stringOrNull(fd.get("color")),
        angle: stringOrNull(fd.get("angle")),
        isPrimary: fd.get("isPrimary") === "on",
        sortOrder: Number(fd.get("sortOrder") ?? 0),
      });
      await fetchApi(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: input,
      });
      qc.invalidateQueries({ queryKey });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-paper-line bg-paper-soft p-4">
      <p className="text-sm font-semibold text-ink">Thêm ảnh mới</p>
      <div className="mt-3">
        <ImageUploader
          value={url}
          onChange={setUrl}
          resource="products"
          slug={productSlug}
        />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <FormField label="Alt text" name="alt" required placeholder="VinFast VF3 màu đỏ góc trước" />
        <FormField label="Màu xe" name="color" placeholder="đỏ, trắng, xám…" />
        <FormField label="Góc chụp" name="angle" placeholder="Góc trước, Góc nghiêng…" />
        <FormField label="Thứ tự" name="sortOrder" type="number" defaultValue="0" />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink-soft">
        <input type="checkbox" name="isPrimary" className="h-4 w-4 accent-brand" />
        Đặt làm ảnh chính (Primary)
      </label>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Đang lưu…" : "Lưu ảnh"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-ink-muted hover:text-ink"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-ink-soft">
      <span>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function DescriptionField({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="mt-4">
      <p className="block text-sm font-semibold text-ink-soft">Mô tả sản phẩm (rich text)</p>
      <p className="mt-0.5 text-xs font-normal text-ink-muted">
        Toolbar bold/italic/heading/list/link/quote. Lưu dạng markdown, render trên /xe/{`{slug}`}.
      </p>
      <input type="hidden" name="description" value={value} />
      <div className="mt-1.5">
        <RichEditor
          value={value}
          onChange={setValue}
          placeholder="VinFast VF 8 là mẫu D-SUV 5 chỗ cao cấp..."
        />
      </div>
    </div>
  );
}

function FormSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm font-semibold text-ink-soft">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function chip(active: boolean) {
  return `rounded-full border px-3 py-1 text-sm capitalize transition ${
    active
      ? "border-ink bg-ink text-white"
      : "border-paper-line bg-white text-ink hover:border-ink"
  }`;
}

function stringOrNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length > 0 ? s : null;
}

// Sanity check that we import the entity (for unused warning suppression)
export const _entityCheck = ProductEntity;
