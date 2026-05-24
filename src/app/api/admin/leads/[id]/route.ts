import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { LeadStatusUpdateInput } from "@/lib/zod";
import { getLead, updateLeadStatus } from "@/server/services/leads";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    return getLead(id);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const input = await parseJsonBody(req, LeadStatusUpdateInput);
    return updateLeadStatus(id, input);
  });
}
