import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { StoragePresignInput } from "@/lib/zod";
import { createPresignedUpload } from "@/server/services/storage";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, StoragePresignInput);
    return createPresignedUpload(input);
  });
}
