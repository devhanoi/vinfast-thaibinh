import { z } from "zod";

export const ApiErrorBody = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const ApiErrorResponse = z.object({ error: ApiErrorBody });

export type ApiErrorBodyT = z.infer<typeof ApiErrorBody>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
