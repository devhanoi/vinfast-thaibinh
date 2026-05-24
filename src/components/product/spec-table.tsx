import type { CmsProduct } from "@/server/cms/types";
import { formatVND } from "@/lib/utils";

type Row = { label: string; value: string | number | null | undefined };

export function SpecTable({ product }: { product: CmsProduct }) {
  const specs = product.specs;

  const rows: Row[] = [
    { label: "Giá niêm yết từ", value: formatVND(product.priceFrom) },
    { label: "Phân khúc", value: product.segment },
    { label: "Pin", value: product.battery },
    {
      label: "Quãng đường (1 lần sạc)",
      value: product.rangeKm ? `${product.rangeKm} km` : product.rangeText,
    },
    { label: "Công suất motor", value: pickSpec(specs, "power", "motor") },
    { label: "Tăng tốc 0–100 km/h", value: pickSpec(specs, "acceleration", "0to100") },
    { label: "Tốc độ tối đa", value: pickSpec(specs, "topSpeed", "vmax") },
    { label: "Sạc nhanh DC", value: pickSpec(specs, "fastCharging", "dc") },
    { label: "Sạc AC", value: pickSpec(specs, "acCharging", "ac") },
    { label: "Số chỗ ngồi", value: pickSpec(specs, "seats") },
    { label: "Trọng lượng", value: pickSpec(specs, "weight") },
    { label: "Kích thước (D × R × C)", value: pickSpec(specs, "dimensions", "size") },
    { label: "Bảo hành xe", value: pickSpec(specs, "warranty") ?? "7 năm hoặc 160.000 km" },
    { label: "Bảo hành pin", value: pickSpec(specs, "batteryWarranty") ?? "8 năm / 200.000 km" },
  ];

  const visible = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");

  return (
    <div className="overflow-hidden rounded-2xl border border-paper-line bg-white">
      <table className="w-full text-left text-sm">
        <tbody>
          {visible.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-paper-soft"}>
              <th
                scope="row"
                className="w-1/2 px-4 py-3 font-medium text-ink-muted md:w-1/3 md:px-6"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 font-semibold text-ink md:px-6">{String(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function pickSpec(specs: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const v = specs[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return null;
}
