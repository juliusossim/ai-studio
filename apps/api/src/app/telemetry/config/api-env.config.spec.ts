import { buildApiEnvFilePaths, validateApiEnv } from './api-env.config';

describe('api env config', () => {
  const originalEnv = process.env;
  const baseConfig = (): Record<string, string> => ({
    DATABASE_URL: 'postgresql://ripples:ripples@localhost:5432/ripples',
    MEDIA_STORAGE_BUCKET: 'ripples-media',
    MEDIA_STORAGE_PUBLIC_BASE_URL: 'https://media.ripples.test',
    MEDIA_STORAGE_REGION: 'us-east-1',
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('normalizes defaults and mirrors them back to process.env', () => {
    const validated = validateApiEnv(baseConfig());

    expect(validated.NODE_ENV).toBe('development');
    expect(validated.PORT).toBe('3000');
    expect(process.env.PORT).toBe('3000');
    expect(process.env.LOG_LEVEL).toBe('debug');
    expect(process.env.MEDIA_UPLOAD_URL_TTL_SECONDS).toBe('900');
    expect(process.env.API_RATE_LIMIT_LIMIT).toBe('120');
  });

  it('requires production secrets', () => {
    expect(() =>
      validateApiEnv({
        NODE_ENV: 'production',
        ...baseConfig(),
      }),
    ).toThrow('Missing required production environment variable: AUTH_JWT_SECRET');
  });

  it('requires secure cookies when same-site none is configured', () => {
    expect(() =>
      validateApiEnv({
        AUTH_COOKIE_SAME_SITE: 'none',
        AUTH_COOKIE_SECURE: 'false',
        ...baseConfig(),
      }),
    ).toThrow('AUTH_COOKIE_SAME_SITE=none requires AUTH_COOKIE_SECURE=true.');
  });

  it('requires paired media storage static credentials when either one is configured', () => {
    expect(() =>
      validateApiEnv({
        ...baseConfig(),
        MEDIA_STORAGE_ACCESS_KEY_ID: 'access-key',
      }),
    ).toThrow(
      'MEDIA_STORAGE_ACCESS_KEY_ID and MEDIA_STORAGE_SECRET_ACCESS_KEY must be provided together.',
    );
  });

  it('normalizes trust proxy configuration when provided', () => {
    const validated = validateApiEnv({
      ...baseConfig(),
      HTTP_TRUST_PROXY: 'loopback, linklocal',
    });

    expect(validated.HTTP_TRUST_PROXY).toBe('loopback,linklocal');
  });

  it('builds layered env file candidates with app-local precedence', () => {
    process.env.NODE_ENV = 'test';

    const paths = buildApiEnvFilePaths();

    expect(paths[0]).toContain('apps/api/.env.test.local');
    expect(paths[1]).toContain('apps/api/.env.local');
    expect(paths[2]).toContain('apps/api/.env.test');
    expect(paths[3]).toContain('apps/api/.env');
  });
});
