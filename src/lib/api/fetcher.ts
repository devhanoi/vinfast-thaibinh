import type { z } from "zod";
import { ApiError } from "./response";

type FetcherInit = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type FetcherOptions<T> = FetcherInit & {
  schema?: z.ZodType<T>;
};

export async function fetchApi<T = unknown>(
  input: string,
  options: FetcherOptions<T> = {},
): Promise<T> {
  const { schema, body, headers, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(input, init);
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const errBody = (json as { error?: { code?: string; message?: string; details?: unknown } })?.error;
    throw new ApiError(
      res.status,
      errBody?.code ?? "http_error",
      errBody?.message ?? res.statusText ?? "Request failed",
      errBody?.details,
    );
  }

  const data = (json as { data?: unknown })?.data;
  if (!schema) return data as T;
  return schema.parse(data);
}
