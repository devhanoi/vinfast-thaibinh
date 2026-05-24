import { handle } from "@/app/api/_lib/handle";
import { getHomePageData } from "@/server/services/home";

export const revalidate = 300;

export async function GET() {
  return handle(async () => getHomePageData());
}
