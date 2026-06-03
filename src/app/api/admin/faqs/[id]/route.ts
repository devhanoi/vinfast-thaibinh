import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { FaqUpdateInput } from "@/lib/zod";
import { deleteFaq, getFaq, updateFaq } from "@/server/services/faqs";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    return getFaq(id);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const input = await parseJsonBody(req, FaqUpdateInput);
    return updateFaq(id, input);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await deleteFaq(id);
    return undefined;
  });
}
