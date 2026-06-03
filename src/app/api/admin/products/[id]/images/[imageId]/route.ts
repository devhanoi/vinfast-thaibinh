import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { ProductImageUpdateInput } from "@/lib/zod";
import { deleteProductImage, updateProductImage } from "@/server/services/products";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string; imageId: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id, imageId } = await ctx.params;
    const input = await parseJsonBody(req, ProductImageUpdateInput);
    return updateProductImage(id, imageId, input);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { imageId } = await ctx.params;
    await deleteProductImage(imageId);
    return undefined;
  });
}
