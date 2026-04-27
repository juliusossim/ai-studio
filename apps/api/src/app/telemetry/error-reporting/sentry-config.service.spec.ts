import { createSentryOptions, readSentryRuntimeConfig } from './sentry-config.service';
import { sanitizeSentryEvent } from './sentry-sanitization';
import type { ErrorEvent } from '@sentry/nestjs';

describe('Sentry config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env['NODE_ENV'];
    delete process.env['SENTRY_DEBUG'];
    delete process.env['SENTRY_DSN'];
    delete process.env['SENTRY_ENABLED'];
    delete process.env['SENTRY_ENVIRONMENT'];
    delete process.env['SENTRY_RELEASE'];
    delete process.env['SENTRY_SAMPLE_RATE'];
    delete process.env['SENTRY_SHUTDOWN_TIMEOUT_MS'];
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('stays disabled when no Sentry DSN is configured', () => {
    const config = readSentryRuntimeConfig();

    expect(config.enabled).toBe(false);
    expect(createSentryOptions(config)).toBeUndefined();
  });

  it('enables Sentry automatically when a DSN is present', () => {
    process.env['SENTRY_DSN'] = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    process.env['NODE_ENV'] = 'production';
    process.env['SENTRY_RELEASE'] = 'ripples-api@1.2.3';

    const config = readSentryRuntimeConfig();
    const options = createSentryOptions(config);

    expect(config.enabled).toBe(true);
    expect(config.environment).toBe('production');
    expect(config.release).toBe('ripples-api@1.2.3');
    expect(options?.dsn).toBe('https://examplePublicKey@o0.ingest.sentry.io/0');
    expect(options?.sendDefaultPii).toBe(false);
  });

  it('respects explicit disablement even when a DSN exists', () => {
    process.env['SENTRY_ENABLED'] = 'false';
    process.env['SENTRY_DSN'] = 'https://examplePublicKey@o0.ingest.sentry.io/0';

    expect(readSentryRuntimeConfig().enabled).toBe(false);
  });

  it('falls back to safe defaults when optional numeric values are invalid', () => {
    process.env['SENTRY_ENABLED'] = 'true';
    process.env['SENTRY_DSN'] = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    process.env['SENTRY_SAMPLE_RATE'] = 'not-a-number';
    process.env['SENTRY_SHUTDOWN_TIMEOUT_MS'] = '200000';

    const config = readSentryRuntimeConfig();

    expect(config.sampleRate).toBe(1);
    expect(config.shutdownTimeoutMs).toBe(2000);
  });

  it('scrubs sensitive request and user data before sending events', () => {
    const event: ErrorEvent = {
      extra: {
        refreshToken: 'refresh-token',
      },
      request: {
        cookies: {
          session: 'sensitive',
        },
        data: {
          password: 'password',
        },
        headers: {
          authorization: 'Bearer token',
          'x-request-id': 'req-123',
        },
      },
      user: {
        email: 'user@example.com',
        id: 'user-123',
        ip_address: '127.0.0.1',
      },
      type: undefined,
    };
    const sanitized = sanitizeSentryEvent(event);

    expect(sanitized?.request?.cookies).toBeUndefined();
    expect(sanitized?.request?.data).toBeUndefined();
    expect(sanitized?.request?.headers).toEqual({
      authorization: '[Redacted]',
      'x-request-id': 'req-123',
    });
    expect(sanitized?.extra).toEqual({
      refreshToken: '[Redacted]',
    });
    expect(sanitized?.user).toEqual({
      id: 'user-123',
    });
  });
});
