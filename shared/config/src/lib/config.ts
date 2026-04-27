type EnvRecord = Record<string, string | undefined>;

/**
 * Resolves environment variables from the current runtime:
 * - Node.js / server-side: reads from `process.env`
 * - Vite apps: reads from `import.meta.env`
 * - Fallback: returns an empty record
 */
function getRuntimeEnv(): EnvRecord {
  // Node / SSR
  if (typeof process !== 'undefined' && process.env) {
    return process.env as EnvRecord;
  }
  // Vite client-side. Indirect eval keeps this file parse-safe in CommonJS-based test runners.
  const importMetaEnv = readImportMetaEnv();
  if (importMetaEnv) {
    return importMetaEnv;
  }
  return {};
}

/** Return a single env variable or `undefined`. */
export function getEnv(key: string): string | undefined {
  return getRuntimeEnv()[key];
}

/**
 * Return a single env variable or throw if it is missing / empty.
 * Use this for variables that must be present at runtime.
 */
export function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Retrieve multiple env variables at once.
 *
 * @example
 * const { API_URL, API_KEY } = getEnvs('API_URL', 'API_KEY');
 */
export function getEnvs<K extends string>(...keys: K[]): Record<K, string | undefined> {
  const env = getRuntimeEnv();
  return Object.fromEntries(keys.map((key) => [key, env[key]])) as Record<K, string | undefined>;
}

/**
 * Boolean helper – returns `true` when the variable equals
 * `"true"` or `"1"` (case-insensitive).
 */
export function getEnvFlag(key: string): boolean {
  return getEnvBoolean(key, false) ?? false;
}

export function getEnvBoolean(key: string, fallback?: boolean): boolean | undefined {
  const value = getEnv(key)?.trim().toLowerCase();
  if (!value) {
    return fallback;
  }

  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return fallback;
}

export function getEnvNumber(key: string, fallback?: number): number | undefined {
  const value = getEnv(key);
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getEnvInteger(key: string, fallback?: number): number | undefined {
  const value = getEnv(key);
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function getEnvList(key: string, fallback: readonly string[] = []): string[] {
  const value = getEnv(key);
  if (!value) {
    return [...fallback];
  }

  const normalized = value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return normalized.length > 0 ? normalized : [...fallback];
}

/**
 * Returns the current runtime environment name.
 * Checks `NODE_ENV` first, then common Vite variables.
 * Defaults to `'development'`.
 */
export function getEnvironment(): string {
  return getEnv('NODE_ENV') ?? getEnv('MODE') ?? 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

export function isTest(): boolean {
  return getEnvironment() === 'test';
}

function readImportMetaEnv(): EnvRecord | undefined {
  try {
    return (0, eval)('import.meta.env') as EnvRecord | undefined;
  } catch {
    return undefined;
  }
}
