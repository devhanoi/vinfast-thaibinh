"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { fetchApi } from "@/lib/api/fetcher";
import { ResourceForm, type FieldDef } from "./resource-form";
import { Modal } from "./modal";

export type Column<T> = {
  key: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type EditFormConfig = {
  fields?: FieldDef[];
  inputSchema?: z.ZodType<unknown>;
  method?: "POST" | "PUT" | "PATCH";
  readonlyKeys?: string[];
  buildEndpoint?: (row: { id?: string; pageKey?: string }, baseEndpoint: string) => string;
  buildDefaults?: (row: unknown) => Record<string, unknown>;
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
  editForm,
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
  editForm?: EditFormConfig;
}) {
  const qc = useQueryClient();
  const queryKey = ["admin", endpoint];

  const [createOpen, setCreateOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchApi(endpoint, { schema: z.array(schema) }),
  });

  const del = useMutation({
    mutationFn: (id: string) => fetchApi(`${endpoint}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const enableEdit = Boolean(editForm && createForm);
  const editFields = editForm?.fields ?? createForm?.fields ?? [];
  const editSchema = editForm?.inputSchema ?? createForm?.inputSchema;
  const editEndpoint = editingRow
    ? editForm?.buildEndpoint
      ? editForm.buildEndpoint(editingRow, endpoint)
      : `${endpoint}/${rowKey(editingRow)}`
    : endpoint;
  const editDefaults = editingRow
    ? editForm?.buildDefaults
      ? editForm.buildDefaults(editingRow)
      : (editingRow as unknown as Record<string, unknown>)
    : undefined;

  const showActionsCol = enableDelete || enableEdit;

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
              onClick={() => setCreateOpen(true)}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus size={16} /> {createForm.triggerLabel ?? "Thêm mới"}
            </button>
          )}
        </div>
      </div>

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
                {showActionsCol && <th className="px-4 py-3 text-right">Hành động</th>}
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
                    {showActionsCol && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {enableEdit && (
                            <button
                              type="button"
                              onClick={() => setEditingRow(row)}
                              className="inline-flex items-center gap-1 rounded-md border border-paper-line px-2 py-1 text-xs text-ink hover:border-brand hover:bg-brand/5"
                              aria-label="Sửa"
                            >
                              <Pencil size={14} /> Sửa
                            </button>
                          )}
                          {enableDelete && (
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
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {createForm && (
        <Modal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title={createForm.triggerLabel ?? "Thêm mới"}
          subtitle="Điền thông tin và bấm Lưu."
          size="lg"
        >
          <ResourceForm
            key="create"
            fields={createForm.fields}
            schema={createForm.inputSchema}
            endpoint={createForm.endpoint ?? endpoint}
            method={createForm.method ?? "POST"}
            invalidateKey={queryKey}
            onDone={() => setCreateOpen(false)}
            submitLabel={createForm.submitLabel ?? "Lưu"}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {enableEdit && editSchema && (
        <Modal
          open={Boolean(editingRow)}
          onClose={() => setEditingRow(null)}
          title="Chỉnh sửa"
          subtitle={editingRow ? `Đang sửa: ${rowKey(editingRow)}` : undefined}
          size="lg"
        >
          {editingRow && (
            <ResourceForm
              key={`edit-${rowKey(editingRow)}`}
              fields={editFields}
              schema={editSchema}
              endpoint={editEndpoint}
              method={editForm?.method ?? "PATCH"}
              invalidateKey={queryKey}
              defaults={editDefaults}
              readonlyKeys={editForm?.readonlyKeys}
              onDone={() => setEditingRow(null)}
              submitLabel="Cập nhật"
            />
          )}
        </Modal>
      )}
    </div>
  );
}
