"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z, ZodError } from "zod";
import { fetchApi } from "@/lib/api/fetcher";
import { ImageUploader } from "./image-uploader";

export type FieldDef = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "url"
    | "image"
    | "stringArray";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  defaultValue?: string | number | boolean;
  uploadResource?: string;
  uploadSlug?: string;
};

export function ResourceForm<TInput>({
  fields,
  schema,
  endpoint,
  method = "POST",
  invalidateKey,
  onDone,
  submitLabel = "Lưu",
}: {
  fields: FieldDef[];
  schema: z.ZodType<TInput>;
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH";
  invalidateKey: readonly unknown[];
  onDone?: () => void;
  submitLabel?: string;
}) {
  const qc = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: (body: TInput) => fetchApi(endpoint, { method, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invalidateKey });
      setErrors({});
      setServerError(null);
      onDone?.();
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, unknown> = {};
    for (const f of fields) {
      const v = fd.get(f.name);
      if (f.type === "checkbox") raw[f.name] = v === "on";
      else if (f.type === "number") raw[f.name] = v === null || v === "" ? undefined : Number(v);
      else if (f.type === "stringArray") {
        const lines = String(v ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        raw[f.name] = lines;
      } else raw[f.name] = v === "" ? undefined : v;
    }
    try {
      const parsed = schema.parse(raw);
      await submit.mutateAsync(parsed);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      if (err instanceof ZodError) {
        const next: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path[0]?.toString();
          if (key) next[key] = issue.message;
        }
        setErrors(next);
        return;
      }
      const e2 = err as { message?: string };
      setServerError(e2.message ?? "Có lỗi xảy ra");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-paper-line bg-white p-5">
      {serverError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.name} def={f} error={errors[f.name]} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submit.isPending}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
        >
          {submit.isPending ? "Đang lưu…" : submitLabel}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-medium text-ink-muted hover:text-ink"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ def, error }: { def: FieldDef; error?: string }) {
  const inputClass =
    "mt-1.5 w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none";
  const errClass = error ? "border-red-300 focus:border-red-500" : "";
  const defaultStr =
    def.defaultValue === undefined ? undefined : String(def.defaultValue);
  const wrapClass =
    def.type === "textarea" || def.type === "image" || def.type === "stringArray"
      ? "md:col-span-2"
      : "";

  return (
    <label className={`block text-sm font-semibold text-ink-soft ${wrapClass}`}>
      <span className="flex items-center gap-1">
        {def.label}
        {def.required && <span className="text-red-500">*</span>}
      </span>
      {def.hint && <span className="mt-0.5 block text-xs font-normal text-ink-muted">{def.hint}</span>}

      {def.type === "textarea" || def.type === "stringArray" ? (
        <textarea
          name={def.name}
          required={def.required}
          placeholder={def.placeholder}
          defaultValue={defaultStr}
          rows={def.rows ?? (def.type === "stringArray" ? 4 : 3)}
          className={`${inputClass} ${errClass}`}
        />
      ) : def.type === "checkbox" ? (
        <input
          type="checkbox"
          name={def.name}
          defaultChecked={Boolean(def.defaultValue)}
          className="mt-2 h-4 w-4 rounded border-paper-line accent-brand"
        />
      ) : def.type === "select" ? (
        <select
          name={def.name}
          required={def.required}
          defaultValue={defaultStr}
          className={`${inputClass} ${errClass}`}
        >
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : def.type === "image" ? (
        <ImageUploadField
          name={def.name}
          defaultValue={defaultStr}
          resource={def.uploadResource}
          slug={def.uploadSlug}
        />
      ) : (
        <input
          type={def.type === "number" ? "number" : "text"}
          name={def.name}
          required={def.required}
          placeholder={def.placeholder}
          defaultValue={defaultStr}
          className={`${inputClass} ${errClass}`}
        />
      )}

      {error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}

function ImageUploadField({
  name,
  defaultValue,
  resource,
  slug,
}: {
  name: string;
  defaultValue?: string;
  resource?: string;
  slug?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  return (
    <div className="mt-1.5">
      <input type="hidden" name={name} value={url} />
      <ImageUploader value={url} onChange={setUrl} resource={resource} slug={slug} />
    </div>
  );
}
