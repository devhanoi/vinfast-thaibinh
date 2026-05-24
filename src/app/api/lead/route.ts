import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { LeadCreateInput } from "@/lib/zod";
import { createLead } from "@/server/services/leads";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handle(async () => {
    const input = await parseJsonBody(req, LeadCreateInput);
    return createLead(input);
  });
}
