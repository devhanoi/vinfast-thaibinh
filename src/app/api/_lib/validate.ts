import type { z } from "zod";

export async function parseJsonBody<T>(req: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  return schema.parse(body);
}

export function parseSearchParams<T>(req: Request, schema: z.ZodType<T>): T {
  const url = new URL(req.url);
  const obj: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) obj[k] = v;
  return schema.parse(obj);
}
