import type { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { getEnvInteger } from '@org/config';
import { ErrorReporterService } from '../error-reporting/error-reporter.service';
import { AppLoggerService } from '../logger/app-logger.service';
import { ApplicationLifecycleService } from './application-lifecycle.service';

type ShutdownSignal = 'SIGINT' | 'SIGTERM';

@Injectable()
export class ProcessLifecycleService {
  private closePromise?: Promise<void>;
  private isRegistered = false;

  constructor(
    private readonly lifecycle: ApplicationLifecycleService,
    private readonly logger: AppLoggerService,
    private readonly errorReporter: ErrorReporterService,
  ) {}

  register(app: INestApplication): void {
    if (this.isRegistered) {
      return;
    }

    this.isRegistered = true;
    process.once('SIGTERM', () => {
      void this.handleSignal(app, 'SIGTERM');
    });
    process.once('SIGINT', () => {
      void this.handleSignal(app, 'SIGINT');
    });
    process.once('unhandledRejection', (reason) => {
      const error = this.toError(reason, 'Unhandled promise rejection');
      void this.handleFatal(app, 'unhandled_rejection', error, 1);
    });
    process.once('uncaughtException', (error) => {
      void this.handleFatal(app, 'uncaught_exception', error, 1);
    });
  }

  private async handleSignal(app: INestApplication, signal: ShutdownSignal): Promise<void> {
    const firstShutdown = this.lifecycle.beginShutdown(`signal:${signal}`);
    if (firstShutdown) {
      this.logger.write('warn', 'Shutdown signal received', {
        signal,
      });
    }

    await this.closeApplication(app, 0, `signal:${signal}`);
  }

  private async handleFatal(
    app: INestApplication,
    reason: string,
    error: Error,
    exitCode: number,
  ): Promise<void> {
    const firstFatal = this.lifecycle.markFatal(reason);
    if (firstFatal) {
      this.logger.write('error', 'Fatal process error captured', {
        err: error,
        reason,
      });
      await this.errorReporter.captureException(error, {
        reason,
      });
    }

    await this.closeApplication(app, exitCode, reason);
  }

  private async closeApplication(
    app: INestApplication,
    exitCode: number,
    reason: string,
  ): Promise<void> {
    if (!this.closePromise) {
      this.closePromise = this.executeGracefulClose(app, exitCode, reason);
    }

    await this.closePromise;
  }

  private async executeGracefulClose(
    app: INestApplication,
    exitCode: number,
    reason: string,
  ): Promise<void> {
    const timeoutMs = this.readShutdownTimeoutMs();
    const forceExitTimer = setTimeout(() => {
      this.logger.write('error', 'Forced process exit after graceful shutdown timeout', {
        exitCode,
        reason,
        timeoutMs,
      });
      process.exit(exitCode);
    }, timeoutMs);
    forceExitTimer.unref();

    try {
      await app.close();
      this.logger.write('info', 'Application shutdown completed', {
        exitCode,
        reason,
      });
    } catch (error) {
      this.logger.write('error', 'Application shutdown failed', {
        err: this.toError(error, 'Application shutdown failed'),
        exitCode,
        reason,
      });
    } finally {
      clearTimeout(forceExitTimer);
      await this.errorReporter.shutdown();
      process.exit(exitCode);
    }
  }

  private readShutdownTimeoutMs(): number {
    const parsedValue = getEnvInteger('RIPPLES_SHUTDOWN_TIMEOUT_MS', 10000);

    if (parsedValue === undefined || parsedValue < 1000) {
      return 10000;
    }

    return parsedValue;
  }

  private toError(value: unknown, fallbackMessage: string): Error {
    if (value instanceof Error) {
      return value;
    }

    if (typeof value === 'string') {
      return new Error(value);
    }

    return new Error(fallbackMessage);
  }
}
