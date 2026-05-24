import { handle } from "@/app/api/_lib/handle";
import { parseJsonBody } from "@/app/api/_lib/validate";
import { ChargingStationUpdateInput } from "@/lib/zod";
import {
  deleteChargingStation,
  getChargingStation,
  updateChargingStation,
} from "@/server/services/charging";
import { requireAdmin } from "@/server/auth/guard";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    return getChargingStation(id);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const input = await parseJsonBody(req, ChargingStationUpdateInput);
    return updateChargingStation(id, input);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await deleteChargingStation(id);
    return undefined;
  });
}
