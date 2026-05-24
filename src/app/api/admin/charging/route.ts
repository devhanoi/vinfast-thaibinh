import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { ChargingStationCreateInput } from "@/lib/zod";
import { createChargingStation, listChargingStations } from "@/server/services/charging";
import { requireAdmin } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return listChargingStations(true);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const input = await parseJsonBody(req, ChargingStationCreateInput);
    return createChargingStation(input);
  });
}
