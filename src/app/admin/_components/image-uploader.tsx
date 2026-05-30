"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  resource = "misc",
  slug = "misc",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  resource?: string;
  slug?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("resource", resource);
      fd.append("slug", slug);
      const res = await fetch("/api/admin/storage/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = json?.error?.message ?? `Upload thất bại (${res.status})`;
        throw new Error(msg);
      }
      onChange(json.data.publicUrl as string);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-paper-line">
            <Image
              src={value}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
              unoptimized={value.startsWith("http")}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
              aria-label="Xóa ảnh"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="grid h-20 w-32 shrink-0 place-items-center rounded-lg border-2 border-dashed border-paper-line text-xs text-ink-muted">
            Chưa có ảnh
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-paper-line bg-white px-3 py-1.5 text-sm font-medium text-ink hover:border-ink disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? "Đang upload…" : value ? "Đổi ảnh" : "Chọn ảnh"}
          </button>
          <p className="text-xs text-ink-muted">JPG, PNG, WebP, AVIF · ≤10MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
