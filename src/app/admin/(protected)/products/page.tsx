"use client";

import Link from "next/link";
import { ProductCreateInput, ProductEntity, type ProductEntityT } from "@/lib/zod";
import { formatVND } from "@/lib/utils";
import { ResourceList } from "../../_components/resource-list";

export default function AdminProductsPage() {
  return (
    <ResourceList<ProductEntityT>
      title="Sản phẩm"
      description="Danh sách xe ô tô, xe dịch vụ và xe máy điện. Click tên để vào trang chi tiết quản lý ảnh."
      endpoint="/api/admin/products"
      schema={ProductEntity}
      createForm={{
        inputSchema: ProductCreateInput,
        triggerLabel: "Thêm sản phẩm",
        submitLabel: "Tạo sản phẩm",
        fields: [
          { name: "name", label: "Tên xe", type: "text", required: true, placeholder: "VinFast VF 9 Plus" },
          {
            name: "slug",
            label: "Slug",
            type: "text",
            required: true,
            placeholder: "vinfast-vf-9-plus",
            hint: "kebab-case (chỉ chữ thường + số + gạch ngang). Dùng cho URL /xe/{slug}.",
          },
          {
            name: "category",
            label: "Phân loại",
            type: "select",
            defaultValue: "car",
            options: [
              { value: "car", label: "Xe ô tô" },
              { value: "service_car", label: "Xe dịch vụ (Minio/Herio/Limo)" },
              { value: "bike", label: "Xe máy điện" },
            ],
          },
          {
            name: "status",
            label: "Trạng thái",
            type: "select",
            defaultValue: "active",
            options: [
              { value: "active", label: "Active (hiện ở landing)" },
              { value: "draft", label: "Draft (ẩn, đang soạn)" },
              { value: "archived", label: "Archived" },
            ],
          },
          { name: "segment", label: "Phân khúc", type: "text", placeholder: "E-SUV 7 chỗ" },
          { name: "tagline", label: "Tagline ngắn", type: "text", placeholder: "Đỉnh cao công nghệ điện" },
          {
            name: "priceFrom",
            label: "Giá từ (VNĐ)",
            type: "number",
            required: true,
            placeholder: "1443000000",
            hint: "Nhập số không dấu phẩy. VD 1443000000 = 1,443 tỷ.",
          },
          { name: "battery", label: "Pin", type: "text", placeholder: "92 kWh" },
          { name: "rangeKm", label: "Quãng đường (km)", type: "number", placeholder: "438" },
          {
            name: "rangeText",
            label: "Range text (xe máy)",
            type: "text",
            placeholder: "Quãng đường 150km",
            hint: "Dùng cho xe máy điện khi không có rangeKm cụ thể.",
          },
          {
            name: "sortOrder",
            label: "Thứ tự",
            type: "number",
            defaultValue: 0,
            hint: "Số nhỏ hiển thị trước.",
          },
          {
            name: "highlights",
            label: "Highlights (mỗi dòng 1 ý)",
            type: "stringArray",
            rows: 4,
            placeholder: "AWD 300 kW\nGhế da Nappa\nSmart Services",
            hint: "Hiển thị thành bullet points trong CarGrid + trang chi tiết.",
          },
        ],
      }}
      editForm={{
        buildDefaults: (row) => {
          const p = row as {
            slug: string;
            name: string;
            category: string;
            status: string;
            segment: string | null;
            tagline: string | null;
            description: string | null;
            priceFrom: number;
            battery: string | null;
            rangeKm: number | null;
            rangeText: string | null;
            sortOrder: number;
            highlights: string[];
          };
          return {
            ...p,
            segment: p.segment ?? "",
            tagline: p.tagline ?? "",
            description: p.description ?? "",
            battery: p.battery ?? "",
            rangeText: p.rangeText ?? "",
            highlights: (p.highlights ?? []).join("\n"),
          };
        },
      }}
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
