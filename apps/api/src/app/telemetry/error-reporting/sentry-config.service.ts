import { Injectable } from '@nestjs/common';
import type { ErrorEvent, EventHint, NodeOptions } from '@sentry/nestjs';
import {
  getEnv,
  getEnvironment,
  getEnvBoolean,
  getEnvInteger,
  getEnvNumber,
  requireEnv,
} from '@org/config';
import { sanitizeSentryEvent } from './sentry-sanitization';

const defaultShutdownTimeoutMs = 2000;
const defaultErrorSampleRate = 1;

export interface SentryRuntimeConfig {
  readonly debug: boolean;
  readonly enabled: boolean;
  readonly environment: string;
  readonly release?: string;
  readonly sampleRate: number;
  readonly shutdownTimeoutMs: number;
}

export function readSentryRuntimeConfig(): SentryRuntimeConfig {
  const enabled = readEnabledFlag();
  const sampleRate = getEnvNumber('SENTRY_SAMPLE_RATE', defaultErrorSampleRate);

  return {
    debug: getEnvBoolean('SENTRY_DEBUG', false) ?? false,
    enabled,
    environment: getEnv('SENTRY_ENVIRONMENT') ?? getEnvironment(),
    ...(getEnv('SENTRY_RELEASE') ? { release: getEnv('SENTRY_RELEASE') } : {}),
    sampleRate:
      sampleRate !== undefined && sampleRate >= 0 && sampleRate <= 1
        ? sampleRate
        : defaultErrorSampleRate,
    shutdownTimeoutMs: clampInteger(
      getEnvInteger('SENTRY_SHUTDOWN_TIMEOUT_MS', defaultShutdownTimeoutMs),
      500,
      30000,
      defaultShutdownTimeoutMs,
    ),
  };
}

export function createSentryOptions(
  config: Readonly<SentryRuntimeConfig>,
): NodeOptions | undefined {
  if (!config.enabled) {
    return undefined;
  }

  const dsn = requireEnv('SENTRY_DSN');

  return {
    beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
      return sanitizeSentryEvent(event);
    },
    debug: config.debug,
    dsn,
    enabled: true,
    environment: config.environment,
    initialScope: {
      tags: {
        runtime: 'nestjs',
        service: 'ripples-api',
      },
    },
    maxValueLength: 2048,
    normalizeDepth: 5,
    ...(config.release ? { release: config.release } : {}),
    sampleRate: config.sampleRate,
    sendDefaultPii: false,
  };
}

@Injectable()
export class SentryConfigService {
  private readonly config = readSentryRuntimeConfig();

  get debug(): boolean {
    return this.config.debug;
  }

  get enabled(): boolean {
    return this.config.enabled;
  }

  get environment(): string {
    return this.config.environment;
  }

  get release(): string | undefined {
    return this.config.release;
  }

  get sampleRate(): number {
    return this.config.sampleRate;
  }

  get shutdownTimeoutMs(): number {
    return this.config.shutdownTimeoutMs;
  }

  get options(): NodeOptions | undefined {
    return createSentryOptions(this.config);
  }

  get runtimeConfig(): Readonly<SentryRuntimeConfig> {
    return this.config;
  }
}

function readEnabledFlag(): boolean {
  const explicitValue = getEnvBoolean('SENTRY_ENABLED');
  if (explicitValue !== undefined) {
    return explicitValue;
  }

  return Boolean(getEnv('SENTRY_DSN'));
}

function clampInteger(
  value: number | undefined,
  minimum: number,
  maximum: number,
  fallback: number,
): number {
  if (value === undefined || value < minimum || value > maximum) {
    return fallback;
  }

  return value;
}
