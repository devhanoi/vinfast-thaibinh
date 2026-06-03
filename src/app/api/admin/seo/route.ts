import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { SeoUpsertInput } from "@/lib/zod";
import { listSeo, upsertSeo } from "@/server/services/seo";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return listSeo();
  });
}

export async function PUT(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, SeoUpsertInput);
    return upsertSeo(input);
  });
}
