import { handle, REVALIDATE_CMS } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { StoreSettingsUpdateInput } from "@/lib/zod";
import { getStoreSettings, updateStoreSettings } from "@/server/services/store";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return getStoreSettings();
  });
}

export async function PATCH(req: Request) {
  return handle(
    async () => {
      await requireAdmin();
      const input = await parseJsonBody(req, StoreSettingsUpdateInput);
      return updateStoreSettings(input);
    },
    { revalidate: REVALIDATE_CMS },
  );
}
