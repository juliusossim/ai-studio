import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { AppLoggerService } from '../logger/app-logger.service';
import { RequestContextService } from '../request-context/request-context.service';
import { ErrorReporterService } from './error-reporter.service';
import { SentryConfigService } from './sentry-config.service';
import { sanitizeReportingContext } from './sentry-sanitization';

@Injectable()
export class SentryErrorReporterService extends ErrorReporterService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly requestContext: RequestContextService,
    private readonly sentryConfig: SentryConfigService,
  ) {
    super();
  }

  captureException(
    exception: Error,
    context?: Readonly<Record<string, unknown>>,
  ): void | Promise<void> {
    if (!this.sentryConfig.enabled || !Sentry.isEnabled()) {
      return;
    }

    try {
      const requestStore = this.requestContext.getStore();
      const safeContext = sanitizeReportingContext(context);

      Sentry.withScope((scope) => {
        scope.setLevel('error');
        scope.setTag('surface', 'api');

        const statusCode = safeContext?.statusCode;
        if (typeof statusCode === 'number') {
          scope.setTag('status_code', String(statusCode));
        }

        const problemType = safeContext?.problemType;
        if (typeof problemType === 'string' && problemType.length > 0) {
          scope.setTag('problem_type', problemType.slice(0, 200));
        }

        if (requestStore?.userId) {
          scope.setUser({
            id: requestStore.userId,
          });
        }

        scope.setContext('request', {
          method: requestStore?.method,
          path: requestStore?.path,
          requestId: requestStore?.requestId,
          startedAt: requestStore?.startedAt,
        });

        if (safeContext && Object.keys(safeContext).length > 0) {
          scope.setContext('ripples', safeContext);
        }

        Sentry.captureException(exception);
      });
    } catch (reportingError) {
      this.logger.write('warn', 'Sentry capture failed', {
        err:
          reportingError instanceof Error
            ? reportingError
            : new Error('Unknown Sentry capture failure'),
      });
    }
  }

  async shutdown(): Promise<void> {
    if (!this.sentryConfig.enabled || !Sentry.isEnabled()) {
      return;
    }

    try {
      await Sentry.close(this.sentryConfig.shutdownTimeoutMs);
    } catch (error) {
      this.logger.write('warn', 'Sentry shutdown failed', {
        err: error instanceof Error ? error : new Error('Unknown Sentry shutdown failure'),
      });
    }
  }
}
