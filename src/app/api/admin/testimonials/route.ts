import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { TestimonialCreateInput } from "@/lib/zod";
import { createTestimonial, listTestimonials } from "@/server/services/testimonials";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return listTestimonials(true);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, TestimonialCreateInput);
    return createTestimonial(input);
  });
}
