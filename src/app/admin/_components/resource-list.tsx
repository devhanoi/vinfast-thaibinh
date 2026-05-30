"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { fetchApi } from "@/lib/api/fetcher";

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
}: {
  title: string;
  description?: string;
  endpoint: string;
  schema: z.ZodType<T>;
  columns: Column<T>[];
  rowKey?: (row: T) => string;
  enableDelete?: boolean;
}) {
  const qc = useQueryClient();
  const queryKey = ["admin", endpoint];

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
        <p className="text-xs text-ink-muted">
          {isLoading ? "Đang tải…" : `${data?.length ?? 0} bản ghi`}
        </p>
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

      <p className="mt-4 text-xs text-ink-muted">
        Form thêm/sửa chi tiết sẽ build incrementally. Hiện tại có thể tạo qua API trực tiếp:{" "}
        <code className="rounded bg-paper-soft px-1.5 py-0.5">{endpoint}</code> (POST/PATCH).
      </p>
    </div>
  );
}
