import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { HeroSlideCreateInput } from "@/lib/zod";
import { createHeroSlide, listHeroSlides } from "@/server/services/hero";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return listHeroSlides(true);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, HeroSlideCreateInput);
    return createHeroSlide(input);
  });
}
