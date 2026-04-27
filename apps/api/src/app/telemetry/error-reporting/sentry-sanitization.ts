import type { ErrorEvent, RequestEventData } from '@sentry/nestjs';

const maxSanitizationDepth = 5;
const redactedValue = '[Redacted]';
const sensitiveKeyPattern =
  /authorization|cookie|password|refresh.?token|access.?token|token|secret|api.?key|code/i;

export function sanitizeSentryEvent(event: ErrorEvent): ErrorEvent | null {
  const sanitizedRequest = event.request ? sanitizeRequest(event.request) : undefined;

  const sanitizedUser = event.user
    ? (() => {
        const {
          email: _email,
          ip_address: _ipAddress,
          name: _name,
          username: _username,
          ...safeUser
        } = event.user;

        return safeUser;
      })()
    : undefined;

  return {
    ...event,
    contexts: sanitizeUnknown(event.contexts, 0) as ErrorEvent['contexts'],
    extra: sanitizeUnknown(event.extra, 0) as ErrorEvent['extra'],
    request: sanitizedRequest,
    user: sanitizedUser,
  };
}

export function sanitizeReportingContext(
  context?: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> | undefined {
  if (!context) {
    return undefined;
  }

  return sanitizeUnknown(context, 0) as Readonly<Record<string, unknown>>;
}

function sanitizeUnknown(value: unknown, depth: number): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth >= maxSanitizationDepth) {
    return typeof value === 'object' ? '[Truncated]' : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeUnknown(item, depth + 1));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
    };
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sensitiveKeyPattern.test(key) ? redactedValue : sanitizeUnknown(nestedValue, depth + 1),
      ]),
    );
  }

  return value;
}

function sanitizeRequest(request: RequestEventData): RequestEventData {
  return {
    ...request,
    cookies: undefined,
    data: undefined,
    env: sanitizeStringRecord(request.env),
    headers: sanitizeStringRecord(request.headers),
  };
}

function sanitizeStringRecord(
  value: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!value) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      sensitiveKeyPattern.test(key)
        ? redactedValue
        : String(sanitizeUnknown(nestedValue, maxSanitizationDepth - 1)),
    ]),
  );
}
