import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { TestimonialUpdateInput } from "@/lib/zod";
import {
  deleteTestimonial,
  getTestimonial,
  updateTestimonial,
} from "@/server/services/testimonials";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    return getTestimonial(id);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const input = await parseJsonBody(req, TestimonialUpdateInput);
    return updateTestimonial(id, input);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await deleteTestimonial(id);
    return undefined;
  });
}
