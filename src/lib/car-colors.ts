import type { CmsProductImage } from "@/server/cms/types";

/**
 * Map color slug (lưu trong DB / parse từ tên file ảnh) sang label + hex.
 * Slug có thể là: "do", "trang", "den", "xam", "vang", "xanh", "xanh-duong",
 * "xanh-reu", "den-vang" hoặc có dấu Vietnamese. Match cả 2 dạng.
 */
const COLOR_MAP: Record<string, { label: string; hex: string; gradient?: string }> = {
  do: { label: "Đỏ", hex: "#dc2626" },
  "đỏ": { label: "Đỏ", hex: "#dc2626" },
  trang: { label: "Trắng", hex: "#f5f5f5" },
  "trắng": { label: "Trắng", hex: "#f5f5f5" },
  den: { label: "Đen", hex: "#0a0a0a" },
  "đen": { label: "Đen", hex: "#0a0a0a" },
  xam: { label: "Xám", hex: "#6b7280" },
  "xám": { label: "Xám", hex: "#6b7280" },
  vang: { label: "Vàng", hex: "#fbbf24" },
  "vàng": { label: "Vàng", hex: "#fbbf24" },
  cam: { label: "Cam", hex: "#f97316" },
  hong: { label: "Hồng", hex: "#ec4899" },
  bac: { label: "Bạc", hex: "#cbd5e1" },
  xanh: { label: "Xanh dương", hex: "#1d4ed8" },
  "xanh-duong": { label: "Xanh dương", hex: "#1d4ed8" },
  "xanh duong": { label: "Xanh dương", hex: "#1d4ed8" },
  "xanh-la": { label: "Xanh lá", hex: "#16a34a" },
  "xanh-reu": { label: "Xanh rêu", hex: "#365314" },
  "xanh reu": { label: "Xanh rêu", hex: "#365314" },
  "den-vang": {
    label: "Đen - Vàng",
    hex: "#fbbf24",
    gradient: "linear-gradient(135deg, #0a0a0a 50%, #fbbf24 50%)",
  },
  "trang-do": {
    label: "Trắng - Đỏ",
    hex: "#dc2626",
    gradient: "linear-gradient(135deg, #f5f5f5 50%, #dc2626 50%)",
  },
};

export type CarColor = {
  slug: string;
  label: string;
  hex: string;
  gradient?: string;
  isLight: boolean;
};

/**
 * Trích các màu UNIQUE từ danh sách ảnh, theo thứ tự xuất hiện (primary trước).
 */
export function extractCarColors(images: CmsProductImage[]): CarColor[] {
  const seen = new Set<string>();
  const out: CarColor[] = [];
  for (const img of images) {
    if (!img.color) continue;
    const slug = img.color.trim().toLowerCase();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const meta = COLOR_MAP[slug] ?? { label: capitalize(img.color), hex: "#9ca3af" };
    out.push({
      slug,
      label: meta.label,
      hex: meta.hex,
      gradient: meta.gradient,
      isLight: isLightColor(meta.hex),
    });
  }
  return out;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isLightColor(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length !== 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 200;
}
