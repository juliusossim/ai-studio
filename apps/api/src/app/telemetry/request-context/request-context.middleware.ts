import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AppLoggerService } from '../logger/app-logger.service';
import type { ObservedRequest } from '../telemetry.types';
import { RequestContextService } from './request-context.service';

const maxRequestIdLength = 128;

interface ResponseWithEvents {
  writableEnded: boolean;
  statusCode: number;
  on(event: 'close' | 'finish', listener: () => void): void;
  setHeader(name: string, value: string): void;
}

type NextFunction = () => void;

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    private readonly requestContext: RequestContextService,
    private readonly logger: AppLoggerService,
  ) {}

  use(request: ObservedRequest, response: ResponseWithEvents, next: NextFunction): void {
    const requestId = this.readRequestId(request.header('x-request-id'));
    const startedAt = Date.now();
    const requestPath = request.originalUrl || request.url;
    const observedRequest = request;
    observedRequest.requestId = requestId;
    response.setHeader('x-request-id', requestId);

    this.requestContext.run(
      {
        requestId,
        method: request.method,
        path: requestPath,
        startedAt,
      },
      () => {
        response.on('finish', () => {
          const durationMs = Date.now() - startedAt;
          const level = this.readLogLevel(response.statusCode);

          this.logger.write(level, 'Request completed', {
            durationMs,
            ip: observedRequest.ips[0] ?? observedRequest.ip,
            method: observedRequest.method,
            path: requestPath,
            requestId,
            statusCode: response.statusCode,
            userAgent: observedRequest.header('user-agent'),
            userId: observedRequest.user?.id,
          });
        });

        response.on('close', () => {
          if (!response.writableEnded) {
            this.logger.write('warn', 'Request closed before completion', {
              method: observedRequest.method,
              path: requestPath,
              requestId,
              userId: observedRequest.user?.id,
            });
          }
        });

        next();
      },
    );
  }

  private readRequestId(incomingRequestId: string | undefined): string {
    const normalized = incomingRequestId?.trim();
    if (!normalized || normalized.length > maxRequestIdLength) {
      return randomUUID();
    }

    return normalized;
  }

  private readLogLevel(statusCode: number): 'error' | 'info' | 'warn' {
    if (statusCode >= 500) {
      return 'error';
    }

    if (statusCode >= 400) {
      return 'warn';
    }

    return 'info';
  }
}
