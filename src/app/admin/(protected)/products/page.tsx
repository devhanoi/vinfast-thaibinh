"use client";

import Link from "next/link";
import { ProductEntity, type ProductEntityT } from "@/lib/zod";
import { formatVND } from "@/lib/utils";
import { ResourceList } from "../../_components/resource-list";

export default function AdminProductsPage() {
  return (
    <ResourceList<ProductEntityT>
      title="Sản phẩm"
      description="Danh sách xe ô tô, xe dịch vụ và xe máy điện. Click tên để vào trang chi tiết quản lý ảnh."
      endpoint="/api/admin/products"
      schema={ProductEntity}
      columns={[
        {
          key: "name",
          label: "Tên xe",
          cell: (p) => (
            <Link
              href={`/admin/products/${p.id}`}
              className="font-semibold text-ink hover:text-brand hover:underline"
            >
              {p.name}
            </Link>
          ),
        },
        { key: "slug", label: "Slug", cell: (p) => <code className="text-xs text-ink-muted">{p.slug}</code> },
        { key: "category", label: "Phân loại", cell: (p) => p.category },
        { key: "price", label: "Giá từ", cell: (p) => formatVND(p.priceFrom) },
        {
          key: "images",
          label: "Ảnh",
          cell: (p) => (
            <span className={p.images.length === 0 ? "text-red-600" : ""}>
              {p.images.length} ảnh
            </span>
          ),
        },
        {
          key: "status",
          label: "Trạng thái",
          cell: (p) => (
            <span
              className={
                p.status === "active"
                  ? "rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand"
                  : "rounded-full bg-paper-soft px-2 py-0.5 text-xs text-ink-muted"
              }
            >
              {p.status}
            </span>
          ),
        },
      ]}
    />
  );
}
