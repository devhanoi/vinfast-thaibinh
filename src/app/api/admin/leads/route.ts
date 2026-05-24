import { handle } from "@/app/api/_lib/handle";
import { parseSearchParams } from "@/app/api/_lib/validate";
import { LeadListQuery } from "@/lib/zod";
import { listLeads } from "@/server/services/leads";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const query = parseSearchParams(req, LeadListQuery);
    return listLeads(query);
  });
}
