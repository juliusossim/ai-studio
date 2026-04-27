/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app/app.module';
import { AuthConfigService } from './app/auth/services/auth-config.service';
import { createValidationException } from './app/telemetry/http/validation/validation-exception.factory';
import { ApplicationLifecycleService } from './app/telemetry/lifecycle/application-lifecycle.service';
import { ProcessLifecycleService } from './app/telemetry/lifecycle/process-lifecycle.service';
import {
  captureBootstrapFailure,
  initializeSentry,
} from './app/telemetry/error-reporting/sentry.bootstrap';
import { SentryConfigService } from './app/telemetry/error-reporting/sentry-config.service';
import { AppLoggerService } from './app/telemetry/logger/app-logger.service';
initializeSentry();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const appLogger = app.get(AppLoggerService);
  const applicationLifecycle = app.get(ApplicationLifecycleService);
  const configService = app.get(ConfigService);
  const processLifecycle = app.get(ProcessLifecycleService);
  const sentryConfig = app.get(SentryConfigService);
  initializeSentry(sentryConfig.runtimeConfig);
  app.useLogger(appLogger);
  processLifecycle.register(app);
  const authConfig = app.get(AuthConfigService);
  app.disable('x-powered-by');
  configureTrustProxy(app, configService);
  app.use(helmet());
  app.use(
    json({
      limit: Number(configService.get<string>('HTTP_JSON_BODY_LIMIT_BYTES') ?? '1048576'),
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      limit: Number(configService.get<string>('HTTP_URLENCODED_BODY_LIMIT_BYTES') ?? '1048576'),
    }),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: authConfig.allowedCorsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: createValidationException,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      whitelist: true,
    }),
  );
  const port = Number(configService.get<string>('PORT') ?? '3000');
  await app.listen(port);
  applicationLifecycle.markReady();
  appLogger.write('info', 'Ripples API is listening', {
    globalPrefix,
    port: Number(port),
  });
}

void bootstrap().catch(async (error: unknown) => {
  const normalizedError = error instanceof Error ? error : new Error(String(error));

  try {
    await captureBootstrapFailure(normalizedError);
  } catch {
    // Preserve bootstrap failure reporting as best-effort only.
  }

  const message = normalizedError.stack ?? normalizedError.message;
  process.stderr.write(`Failed to bootstrap Ripples API: ${message}\n`);
  process.exit(1);
});

function configureTrustProxy(app: NestExpressApplication, configService: ConfigService): void {
  const value = configService.get<string>('HTTP_TRUST_PROXY');
  if (!value || value === 'false') {
    return;
  }

  if (value === 'true') {
    app.set('trust proxy', true);

    return;
  }

  if (/^\d+$/.test(value)) {
    app.set('trust proxy', Number(value));

    return;
  }

  app.set(
    'trust proxy',
    value.split(',').map((segment) => segment.trim()),
  );
}
