import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody, parseSearchParams } from "@/app/api/_lib/validate";
import { ProductCreateInput, ProductListQuery } from "@/lib/zod";
import { createProduct, listProducts } from "@/server/services/products";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const query = parseSearchParams(req, ProductListQuery);
    return listProducts(query);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, ProductCreateInput);
    return createProduct(input);
  });
}
