"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Plus, Trash2, X } from "lucide-react";
import { fetchApi } from "@/lib/api/fetcher";
import { ResourceForm, type FieldDef } from "./resource-form";

export type Column<T> = {
  key: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function ResourceList<T extends { id?: string; pageKey?: string }>({
  title,
  description,
  endpoint,
  schema,
  columns,
  rowKey = (row) => row.id ?? row.pageKey ?? "",
  enableDelete = true,
  createForm,
}: {
  title: string;
  description?: string;
  endpoint: string;
  schema: z.ZodType<T>;
  columns: Column<T>[];
  rowKey?: (row: T) => string;
  enableDelete?: boolean;
  createForm?: {
    fields: FieldDef[];
    inputSchema: z.ZodType<unknown>;
    endpoint?: string;
    method?: "POST" | "PUT" | "PATCH";
    submitLabel?: string;
    triggerLabel?: string;
  };
}) {
  const qc = useQueryClient();
  const queryKey = ["admin", endpoint];
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchApi(endpoint, { schema: z.array(schema) }),
  });

  const del = useMutation({
    mutationFn: (id: string) => fetchApi(`${endpoint}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-ink-muted">
            {isLoading ? "Đang tải…" : `${data?.length ?? 0} bản ghi`}
          </p>
          {createForm && (
            <button
              type="button"
              onClick={() => setFormOpen((v) => !v)}
              className="btn-primary px-4 py-2 text-sm"
            >
              {formOpen ? <X size={16} /> : <Plus size={16} />}
              {formOpen ? "Đóng" : (createForm.triggerLabel ?? "Thêm mới")}
            </button>
          )}
        </div>
      </div>

      {createForm && formOpen && (
        <div className="mt-6">
          <ResourceForm
            fields={createForm.fields}
            schema={createForm.inputSchema}
            endpoint={createForm.endpoint ?? endpoint}
            method={createForm.method ?? "POST"}
            invalidateKey={queryKey}
            onDone={() => setFormOpen(false)}
            submitLabel={createForm.submitLabel ?? "Lưu"}
          />
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-paper-line bg-white">
        {error ? (
          <div className="p-6 text-sm text-red-600">
            Lỗi tải dữ liệu: {(error as Error).message}
          </div>
        ) : isLoading ? (
          <div className="p-6 text-sm text-ink-muted">Đang tải…</div>
        ) : !data || data.length === 0 ? (
          <div className="p-6 text-sm text-ink-muted">Chưa có bản ghi nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-paper-soft text-left text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 font-semibold ${c.className ?? ""}`}>
                    {c.label}
                  </th>
                ))}
                {enableDelete && <th className="px-4 py-3 text-right">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const id = rowKey(row);
                return (
                  <tr key={id} className="border-t border-paper-line/60 hover:bg-paper-soft/50">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                        {c.cell(row)}
                      </td>
                    ))}
                    {enableDelete && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Xóa "${id}"?`)) del.mutate(id);
                          }}
                          disabled={del.isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-paper-line px-2 py-1 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                          aria-label="Xóa"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
