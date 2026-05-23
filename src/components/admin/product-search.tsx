"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminUiStore } from "./admin-store";

export function ProductSearch() {
  const value = useAdminUiStore((state) => state.productSearch);
  const setValue = useAdminUiStore((state) => state.setProductSearch);
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm sản phẩm trong phiên làm việc..."
        className="pl-9"
      />
    </div>
  );
}
