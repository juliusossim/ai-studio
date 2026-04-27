import { Global, MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ProblemDetailsFactory } from './http/problem-details/problem-details.factory';
import { ProblemDetailsFilter } from './http/problem-details/problem-details.filter';
import { ErrorReporterService } from './error-reporting/error-reporter.service';
import { NoopErrorReporterService } from './error-reporting/noop-error-reporter.service';
import { SentryConfigService } from './error-reporting/sentry-config.service';
import { SentryErrorReporterService } from './error-reporting/sentry-error-reporter.service';
import { ApplicationLifecycleService } from './lifecycle/application-lifecycle.service';
import { ProcessLifecycleService } from './lifecycle/process-lifecycle.service';
import { AppLoggerService } from './logger/app-logger.service';
import { RequestContextMiddleware } from './request-context/request-context.middleware';
import { RequestContextService } from './request-context/request-context.service';

@Global()
@Module({
  providers: [
    AppLoggerService,
    RequestContextService,
    ApplicationLifecycleService,
    ProcessLifecycleService,
    ProblemDetailsFactory,
    SentryConfigService,
    SentryErrorReporterService,
    NoopErrorReporterService,
    RequestContextMiddleware,
    {
      provide: ErrorReporterService,
      inject: [SentryConfigService, SentryErrorReporterService, NoopErrorReporterService],
      useFactory: (
        sentryConfig: SentryConfigService,
        sentryReporter: SentryErrorReporterService,
        noopReporter: NoopErrorReporterService,
      ): ErrorReporterService => {
        return sentryConfig.enabled ? sentryReporter : noopReporter;
      },
    },
    {
      provide: APP_FILTER,
      useClass: ProblemDetailsFilter,
    },
  ],
  exports: [
    AppLoggerService,
    ApplicationLifecycleService,
    ErrorReporterService,
    ProcessLifecycleService,
    RequestContextService,
    SentryConfigService,
  ],
})
export class TelemetryModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*',
    });
  }
}
