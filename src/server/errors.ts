export class DomainError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    super("not_found", `${resource}${id ? ` "${id}"` : ""} không tồn tại`, 404, { resource, id });
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super("validation_failed", message, 400, details);
    this.name = "ValidationError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: unknown) {
    super("conflict", message, 409, details);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Cần đăng nhập") {
    super("unauthorized", message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Không có quyền") {
    super("forbidden", message, 403);
    this.name = "ForbiddenError";
  }
}
