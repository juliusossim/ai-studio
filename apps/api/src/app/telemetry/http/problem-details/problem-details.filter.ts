import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorReporterService } from '../../error-reporting/error-reporter.service';
import { AppLoggerService } from '../../logger/app-logger.service';
import type { ObservedRequest } from '../../telemetry.types';
import { ProblemDetailsFactory } from './problem-details.factory';

@Injectable()
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: AppLoggerService,
    private readonly errorReporter: ErrorReporterService,
    private readonly problemDetailsFactory: ProblemDetailsFactory,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<ObservedRequest>();
    const response = httpContext.getResponse();
    const instance = httpAdapter.getRequestUrl(request);
    const result = this.problemDetailsFactory.create(exception, {
      instance,
      traceId: request.requestId,
    });
    const logPayload = {
      method: request.method,
      path: instance,
      problemType: result.body.type,
      requestId: request.requestId,
      statusCode: result.status,
      userId: request.user?.id,
    };

    if (result.logLevel === 'error') {
      this.logger.write('error', 'Unhandled request exception', {
        ...logPayload,
        err: this.normalizeException(exception),
      });
    } else {
      this.logger.write('warn', 'Handled request exception', logPayload);
    }

    if (result.shouldReport) {
      void this.errorReporter.captureException(this.normalizeException(exception), logPayload);
    }

    httpAdapter.setHeader(response, 'content-type', 'application/problem+json');
    httpAdapter.reply(response, result.body, result.status);
  }

  private normalizeException(exception: unknown): Error {
    if (exception instanceof Error) {
      return exception;
    }

    if (exception instanceof HttpException) {
      return new Error(exception.message);
    }

    return new Error(typeof exception === 'string' ? exception : 'Unknown exception');
  }
}
