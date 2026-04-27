import { Injectable, type LoggerService } from '@nestjs/common';
import type { Bindings, Logger as PinoLogger } from 'pino';
import { RequestContextService } from '../request-context/request-context.service';
import { createPinoLogger } from './pino-logger.factory';

type AppLogLevel = 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly rootLogger = createPinoLogger();

  constructor(private readonly requestContext: RequestContextService) {}

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('trace', message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.writeNestLog('fatal', message, optionalParams);
  }

  write(level: AppLogLevel, message: string, bindings: Bindings = {}): void {
    const logger = this.withContext(bindings);
    logger[level](bindings, message);
  }

  getPinoLogger(): PinoLogger {
    return this.rootLogger;
  }

  private writeNestLog(
    level: AppLogLevel,
    message: unknown,
    optionalParams: readonly unknown[],
  ): void {
    const parsed = this.parseNestLogInput(message, optionalParams);
    const logger = this.withContext(parsed.bindings);
    logger[level](parsed.bindings, parsed.message);
  }

  private withContext(bindings: Bindings = {}): PinoLogger {
    const store = this.requestContext.getStore();
    if (!store) {
      return this.rootLogger;
    }

    return this.rootLogger.child({
      requestId: store.requestId,
      userId: store.userId,
      ...bindings,
    });
  }

  private parseNestLogInput(
    message: unknown,
    optionalParams: readonly unknown[],
  ): { bindings: Bindings; message: string } {
    const bindings: Bindings = {};
    const extra = [...optionalParams];
    const lastParam = extra.at(-1);
    if (typeof lastParam === 'string') {
      bindings.context = lastParam;
      extra.pop();
    }

    const serialized = this.serializeMessage(message);
    if (serialized.err) {
      bindings.err = serialized.err;
    }

    if (extra.length === 1) {
      bindings.meta = this.serializeUnknown(extra[0]);
    } else if (extra.length > 1) {
      bindings.meta = extra.map((value) => this.serializeUnknown(value));
    }

    return {
      bindings,
      message: serialized.message,
    };
  }

  private serializeMessage(message: unknown): { err?: Error; message: string } {
    if (message instanceof Error) {
      return {
        err: message,
        message: message.message,
      };
    }

    if (typeof message === 'string') {
      return { message };
    }

    if (typeof message === 'object' && message !== null) {
      return {
        message: JSON.stringify(message),
      };
    }

    return { message: String(message) };
  }

  private serializeUnknown(value: unknown): unknown {
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
        stack: value.stack,
      };
    }

    return value;
  }
}
