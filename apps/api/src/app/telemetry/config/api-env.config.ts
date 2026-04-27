import { resolve } from 'node:path';

const defaultAuthAccessTokenTtlSeconds = 900;
const defaultAuthRefreshTokenTtlSeconds = 60 * 60 * 24 * 30;
const defaultGoogleOAuthStateTtlSeconds = 600;
const defaultPort = 3000;
const defaultShutdownTimeoutMs = 10000;
const defaultSentrySampleRate = 1;
const defaultSentryShutdownTimeoutMs = 2000;
const defaultMediaUploadUrlTtlSeconds = 900;
const defaultMediaMaxImageBytes = 20 * 1024 * 1024;
const defaultMediaMaxVideoBytes = 200 * 1024 * 1024;
const defaultApiRateLimitTtlMs = 60000;
const defaultApiRateLimitLimit = 120;
const defaultHttpJsonBodyLimitBytes = 1024 * 1024;
const defaultHttpUrlencodedBodyLimitBytes = 1024 * 1024;

type RawConfig = Record<string, unknown>;
type EnvironmentName = 'development' | 'production' | 'test';

export function buildApiEnvFilePaths(): string[] {
  const environment = readEnvironmentName(process.env.NODE_ENV);
  const workspaceRoot = process.cwd();
  const appRoot = resolve(workspaceRoot, 'apps/api');
  const directories = [appRoot, workspaceRoot];

  return directories.flatMap((directory) => [
    resolve(directory, `.env.${environment}.local`),
    resolve(directory, '.env.local'),
    resolve(directory, `.env.${environment}`),
    resolve(directory, '.env'),
  ]);
}

export function validateApiEnv(config: RawConfig): RawConfig {
  const nodeEnv = readEnvironmentName(config.NODE_ENV);
  const port = readInteger(config.PORT, 'PORT', defaultPort, 1, 65535);
  const databaseUrl = readRequiredString(config.DATABASE_URL, 'DATABASE_URL');
  const mediaStorageProvider = readChoice(
    config.MEDIA_STORAGE_PROVIDER,
    'MEDIA_STORAGE_PROVIDER',
    ['s3'] as const,
    's3',
  );
  const authCookieSecure = readBoolean(
    config.AUTH_COOKIE_SECURE,
    'AUTH_COOKIE_SECURE',
    nodeEnv === 'production',
  );
  const authCookieSameSite = readChoice(
    config.AUTH_COOKIE_SAME_SITE,
    'AUTH_COOKIE_SAME_SITE',
    ['lax', 'strict', 'none'] as const,
    'lax',
  );

  if (authCookieSameSite === 'none' && !authCookieSecure) {
    throw new Error('AUTH_COOKIE_SAME_SITE=none requires AUTH_COOKIE_SECURE=true.');
  }

  const normalized = {
    NODE_ENV: nodeEnv,
    PORT: String(port),
    DATABASE_URL: databaseUrl,
    ...(readOptionalString(config.WEB_ORIGIN)
      ? { WEB_ORIGIN: readOptionalString(config.WEB_ORIGIN) }
      : {}),
    ...(readOptionalString(config.AUTH_CORS_ORIGINS)
      ? { AUTH_CORS_ORIGINS: readOptionalString(config.AUTH_CORS_ORIGINS) }
      : {}),
    AUTH_COOKIE_SECURE: String(authCookieSecure),
    AUTH_COOKIE_SAME_SITE: authCookieSameSite,
    AUTH_ACCESS_TOKEN_TTL_SECONDS: String(
      readInteger(
        config.AUTH_ACCESS_TOKEN_TTL_SECONDS,
        'AUTH_ACCESS_TOKEN_TTL_SECONDS',
        defaultAuthAccessTokenTtlSeconds,
        1,
      ),
    ),
    AUTH_REFRESH_TOKEN_TTL_SECONDS: String(
      readInteger(
        config.AUTH_REFRESH_TOKEN_TTL_SECONDS,
        'AUTH_REFRESH_TOKEN_TTL_SECONDS',
        defaultAuthRefreshTokenTtlSeconds,
        1,
      ),
    ),
    GOOGLE_OAUTH_STATE_TTL_SECONDS: String(
      readInteger(
        config.GOOGLE_OAUTH_STATE_TTL_SECONDS,
        'GOOGLE_OAUTH_STATE_TTL_SECONDS',
        defaultGoogleOAuthStateTtlSeconds,
        1,
      ),
    ),
    ...(readOptionalString(config.AUTH_JWT_SECRET)
      ? { AUTH_JWT_SECRET: readOptionalString(config.AUTH_JWT_SECRET) }
      : {}),
    ...(readOptionalString(config.AUTH_PASSWORD_PEPPER)
      ? { AUTH_PASSWORD_PEPPER: readOptionalString(config.AUTH_PASSWORD_PEPPER) }
      : {}),
    ...(readOptionalString(config.GOOGLE_CLIENT_ID)
      ? { GOOGLE_CLIENT_ID: readOptionalString(config.GOOGLE_CLIENT_ID) }
      : {}),
    ...(readOptionalString(config.GOOGLE_CLIENT_SECRET)
      ? { GOOGLE_CLIENT_SECRET: readOptionalString(config.GOOGLE_CLIENT_SECRET) }
      : {}),
    MEDIA_STORAGE_PROVIDER: mediaStorageProvider,
    MEDIA_STORAGE_BUCKET: readRequiredString(config.MEDIA_STORAGE_BUCKET, 'MEDIA_STORAGE_BUCKET'),
    MEDIA_STORAGE_REGION: readRequiredString(config.MEDIA_STORAGE_REGION, 'MEDIA_STORAGE_REGION'),
    MEDIA_STORAGE_PUBLIC_BASE_URL: readRequiredString(
      config.MEDIA_STORAGE_PUBLIC_BASE_URL,
      'MEDIA_STORAGE_PUBLIC_BASE_URL',
    ),
    MEDIA_STORAGE_FORCE_PATH_STYLE: String(
      readBoolean(config.MEDIA_STORAGE_FORCE_PATH_STYLE, 'MEDIA_STORAGE_FORCE_PATH_STYLE', false),
    ),
    MEDIA_UPLOAD_URL_TTL_SECONDS: String(
      readInteger(
        config.MEDIA_UPLOAD_URL_TTL_SECONDS,
        'MEDIA_UPLOAD_URL_TTL_SECONDS',
        defaultMediaUploadUrlTtlSeconds,
        60,
        3600,
      ),
    ),
    MEDIA_MAX_IMAGE_BYTES: String(
      readInteger(
        config.MEDIA_MAX_IMAGE_BYTES,
        'MEDIA_MAX_IMAGE_BYTES',
        defaultMediaMaxImageBytes,
        1,
      ),
    ),
    MEDIA_MAX_VIDEO_BYTES: String(
      readInteger(
        config.MEDIA_MAX_VIDEO_BYTES,
        'MEDIA_MAX_VIDEO_BYTES',
        defaultMediaMaxVideoBytes,
        1,
      ),
    ),
    API_RATE_LIMIT_TTL_MS: String(
      readInteger(
        config.API_RATE_LIMIT_TTL_MS,
        'API_RATE_LIMIT_TTL_MS',
        defaultApiRateLimitTtlMs,
        1000,
      ),
    ),
    API_RATE_LIMIT_LIMIT: String(
      readInteger(config.API_RATE_LIMIT_LIMIT, 'API_RATE_LIMIT_LIMIT', defaultApiRateLimitLimit, 1),
    ),
    HTTP_JSON_BODY_LIMIT_BYTES: String(
      readInteger(
        config.HTTP_JSON_BODY_LIMIT_BYTES,
        'HTTP_JSON_BODY_LIMIT_BYTES',
        defaultHttpJsonBodyLimitBytes,
        1024,
      ),
    ),
    HTTP_URLENCODED_BODY_LIMIT_BYTES: String(
      readInteger(
        config.HTTP_URLENCODED_BODY_LIMIT_BYTES,
        'HTTP_URLENCODED_BODY_LIMIT_BYTES',
        defaultHttpUrlencodedBodyLimitBytes,
        1024,
      ),
    ),
    ...(readOptionalString(config.MEDIA_STORAGE_ENDPOINT)
      ? { MEDIA_STORAGE_ENDPOINT: readOptionalString(config.MEDIA_STORAGE_ENDPOINT) }
      : {}),
    ...(readOptionalString(config.MEDIA_STORAGE_KEY_PREFIX)
      ? { MEDIA_STORAGE_KEY_PREFIX: readOptionalString(config.MEDIA_STORAGE_KEY_PREFIX) }
      : {}),
    ...(readOptionalString(config.MEDIA_STORAGE_ACCESS_KEY_ID)
      ? { MEDIA_STORAGE_ACCESS_KEY_ID: readOptionalString(config.MEDIA_STORAGE_ACCESS_KEY_ID) }
      : {}),
    ...(readOptionalString(config.MEDIA_STORAGE_SECRET_ACCESS_KEY)
      ? {
          MEDIA_STORAGE_SECRET_ACCESS_KEY: readOptionalString(
            config.MEDIA_STORAGE_SECRET_ACCESS_KEY,
          ),
        }
      : {}),
    ...(readOptionalString(config.MEDIA_STORAGE_SESSION_TOKEN)
      ? { MEDIA_STORAGE_SESSION_TOKEN: readOptionalString(config.MEDIA_STORAGE_SESSION_TOKEN) }
      : {}),
    ...(readOptionalString(config.HTTP_TRUST_PROXY)
      ? { HTTP_TRUST_PROXY: normalizeTrustProxyValue(config.HTTP_TRUST_PROXY) }
      : {}),
    LOG_LEVEL: readChoice(
      config.LOG_LEVEL,
      'LOG_LEVEL',
      ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const,
      nodeEnv === 'production' ? 'info' : 'debug',
    ),
    RIPPLES_SHUTDOWN_TIMEOUT_MS: String(
      readInteger(
        config.RIPPLES_SHUTDOWN_TIMEOUT_MS,
        'RIPPLES_SHUTDOWN_TIMEOUT_MS',
        defaultShutdownTimeoutMs,
        1000,
      ),
    ),
    SENTRY_ENABLED: String(
      readBoolean(
        config.SENTRY_ENABLED,
        'SENTRY_ENABLED',
        Boolean(readOptionalString(config.SENTRY_DSN)),
      ),
    ),
    ...(readOptionalString(config.SENTRY_DSN)
      ? { SENTRY_DSN: readOptionalString(config.SENTRY_DSN) }
      : {}),
    SENTRY_ENVIRONMENT: readOptionalString(config.SENTRY_ENVIRONMENT) ?? nodeEnv,
    ...(readOptionalString(config.SENTRY_RELEASE)
      ? { SENTRY_RELEASE: readOptionalString(config.SENTRY_RELEASE) }
      : {}),
    SENTRY_SAMPLE_RATE: String(
      readNumber(config.SENTRY_SAMPLE_RATE, 'SENTRY_SAMPLE_RATE', defaultSentrySampleRate, 0, 1),
    ),
    SENTRY_SHUTDOWN_TIMEOUT_MS: String(
      readInteger(
        config.SENTRY_SHUTDOWN_TIMEOUT_MS,
        'SENTRY_SHUTDOWN_TIMEOUT_MS',
        defaultSentryShutdownTimeoutMs,
        500,
      ),
    ),
  } satisfies Record<string, string>;

  assertAbsoluteUrl(normalized.MEDIA_STORAGE_PUBLIC_BASE_URL, 'MEDIA_STORAGE_PUBLIC_BASE_URL');

  if (
    (normalized.MEDIA_STORAGE_ACCESS_KEY_ID && !normalized.MEDIA_STORAGE_SECRET_ACCESS_KEY) ||
    (!normalized.MEDIA_STORAGE_ACCESS_KEY_ID && normalized.MEDIA_STORAGE_SECRET_ACCESS_KEY)
  ) {
    throw new Error(
      'MEDIA_STORAGE_ACCESS_KEY_ID and MEDIA_STORAGE_SECRET_ACCESS_KEY must be provided together.',
    );
  }

  if (nodeEnv === 'production') {
    assertPresent(normalized.AUTH_JWT_SECRET, 'AUTH_JWT_SECRET');
    assertPresent(normalized.AUTH_PASSWORD_PEPPER, 'AUTH_PASSWORD_PEPPER');
  }

  if (normalized.SENTRY_ENABLED === 'true') {
    assertPresent(normalized.SENTRY_DSN, 'SENTRY_DSN');
  }

  Object.assign(process.env, normalized);

  return {
    ...config,
    ...normalized,
  };
}

function readEnvironmentName(value: unknown): EnvironmentName {
  if (value === 'development' || value === 'production' || value === 'test') {
    return value;
  }

  if (value === undefined || value === null || value === '') {
    return 'development';
  }

  throw new Error('NODE_ENV must be one of development, production, or test.');
}

function readRequiredString(value: unknown, key: string): string {
  const normalized = readOptionalString(value);
  if (!normalized) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return normalized;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function readBoolean(value: unknown, key: string, fallback: boolean): boolean {
  const normalized = readOptionalString(value)?.toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  throw new Error(`${key} must be a boolean-like value (true, false, 1, 0).`);
}

function readInteger(
  value: unknown,
  key: string,
  fallback: number,
  minimum: number,
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  const normalized = readOptionalString(value);
  if (!normalized) {
    return fallback;
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${key} must be an integer between ${minimum} and ${maximum}.`);
  }

  return parsed;
}

function readNumber(
  value: unknown,
  key: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const normalized = readOptionalString(value);
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${key} must be a number between ${minimum} and ${maximum}.`);
  }

  return parsed;
}

function readChoice<T extends string>(
  value: unknown,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const normalized = readOptionalString(value)?.toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if ((allowed as readonly string[]).includes(normalized)) {
    return normalized as T;
  }

  throw new Error(`${key} must be one of: ${allowed.join(', ')}.`);
}

function assertPresent(value: string | undefined, key: string): void {
  if (!value) {
    throw new Error(`Missing required production environment variable: ${key}`);
  }
}

function assertAbsoluteUrl(value: string, key: string): void {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error(`${key} must use http or https.`);
    }
  } catch {
    throw new Error(`${key} must be a valid absolute URL.`);
  }
}

function normalizeTrustProxyValue(value: unknown): string {
  const normalized = readOptionalString(value);
  if (!normalized) {
    throw new Error('HTTP_TRUST_PROXY must be a non-empty string when provided.');
  }

  const lowercase = normalized.toLowerCase();
  if (lowercase === 'true' || lowercase === 'false') {
    return lowercase;
  }

  if (/^\d+$/.test(normalized)) {
    return normalized;
  }

  return normalized
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join(',');
}
