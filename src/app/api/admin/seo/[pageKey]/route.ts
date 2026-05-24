import { handle } from "@/app/api/_lib/handle";
import { deleteSeo, requireSeo } from "@/server/services/seo";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ pageKey: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { pageKey } = await ctx.params;
    return requireSeo(pageKey);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { pageKey } = await ctx.params;
    await deleteSeo(pageKey);
    return undefined;
  });
}
