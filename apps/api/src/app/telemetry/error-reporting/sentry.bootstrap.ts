import * as Sentry from '@sentry/nestjs';
import { createSentryOptions, readSentryRuntimeConfig } from './sentry-config.service';

let sentryInitialized = false;
let shutdownTimeoutMs = 2000;

export function initializeSentry(config = readSentryRuntimeConfig()): void {
  if (sentryInitialized) {
    return;
  }

  shutdownTimeoutMs = config.shutdownTimeoutMs;
  const options = createSentryOptions(config);

  if (!options) {
    return;
  }

  Sentry.init(options);
  sentryInitialized = true;
}

export async function captureBootstrapFailure(error: Error): Promise<void> {
  if (!Sentry.isEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel('fatal');
    scope.setTag('failure_surface', 'bootstrap');
    scope.setContext('bootstrap', {
      phase: 'application_startup',
    });
    Sentry.captureException(error);
  });

  await Sentry.close(shutdownTimeoutMs);
}
