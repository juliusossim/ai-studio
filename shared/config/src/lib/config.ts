type EnvRecord = Record<string, string | undefined>;

interface ImportMetaWithEnv {
  env?: EnvRecord;
}

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
  // Vite client-side (import.meta.env is statically replaced at build time)
  if (import.meta !== undefined && (import.meta as ImportMetaWithEnv).env) {
    return (import.meta as ImportMetaWithEnv).env as EnvRecord;
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
export function getEnvs<K extends string>(
  ...keys: K[]
): Record<K, string | undefined> {
  const env = getRuntimeEnv();
  return keys.reduce(
    (acc, key) => {
      acc[key] = env[key];
      return acc;
    },
    {} as Record<K, string | undefined>,
  );
}

/**
 * Boolean helper – returns `true` when the variable equals
 * `"true"` or `"1"` (case-insensitive).
 */
export function getEnvFlag(key: string): boolean {
  const val = getEnv(key)?.toLowerCase();
  return val === 'true' || val === '1';
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
