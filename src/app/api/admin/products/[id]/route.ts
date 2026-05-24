import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { ProductUpdateInput } from "@/lib/zod";
import { deleteProduct, getProductById, updateProduct } from "@/server/services/products";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    return getProductById(id);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const input = await parseJsonBody(req, ProductUpdateInput);
    return updateProduct(id, input);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await deleteProduct(id);
    return undefined;
  });
}
