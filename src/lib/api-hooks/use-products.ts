import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { fetchApi } from "@/lib/api/fetcher";
import {
  ProductEntity,
  type ProductCreateInputT,
  type ProductEntityT,
  type ProductListQueryT,
  type ProductUpdateInputT,
} from "@/lib/zod";

const KEY = ["admin", "products"] as const;
const BASE = "/api/admin/products";

export function useProducts(query: ProductListQueryT = {}) {
  return useQuery({
    queryKey: [...KEY, query] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.category) params.set("category", query.category);
      if (query.status) params.set("status", query.status);
      if (query.active !== undefined) params.set("active", String(query.active));
      const url = params.toString() ? `${BASE}?${params}` : BASE;
      return fetchApi(url, { schema: z.array(ProductEntity) });
    },
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: [...KEY, id] as const,
    queryFn: () => fetchApi(`${BASE}/${id}`, { schema: ProductEntity }),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductCreateInputT) =>
      fetchApi<ProductEntityT>(BASE, { method: "POST", body: input, schema: ProductEntity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductUpdateInputT) =>
      fetchApi<ProductEntityT>(`${BASE}/${id}`, {
        method: "PATCH",
        body: input,
        schema: ProductEntity,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchApi(`${BASE}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
