import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from '../../../errors/app-exception';
import { problemTypes } from './problem-type.constants';
import type {
  ProblemDetails,
  ProblemDetailsContext,
  ProblemDetailsErrorItem,
  ProblemDetailsResult,
} from './problem-details.types';

interface HttpExceptionResponseBody {
  errors?: readonly ProblemDetailsErrorItem[];
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

@Injectable()
export class ProblemDetailsFactory {
  create(exception: unknown, context: Readonly<ProblemDetailsContext>): ProblemDetailsResult {
    if (exception instanceof AppException) {
      return this.buildResult({
        context,
        detail: exception.detail,
        logLevel: exception.logLevel,
        shouldReport: exception.reportable,
        status: exception.getStatus(),
        title: exception.title,
        type: exception.type,
      });
    }

    if (exception instanceof BadRequestException && this.isValidationException(exception)) {
      const errors = this.readValidationErrors(exception);

      return this.buildResult({
        context,
        detail: 'One or more request fields are invalid.',
        errors,
        logLevel: 'warn',
        shouldReport: false,
        status: HttpStatus.BAD_REQUEST,
        title: 'Request validation failed',
        type: problemTypes.validationError,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const detail = this.readHttpDetail(exception);

      if (status === HttpStatus.UNAUTHORIZED) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Authentication failed',
          type: problemTypes.authenticationFailed,
        });
      }

      if (status === HttpStatus.FORBIDDEN) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Forbidden',
          type: problemTypes.forbidden,
        });
      }

      if (status === HttpStatus.NOT_FOUND) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Resource not found',
          type: problemTypes.notFound,
        });
      }

      if (status === HttpStatus.CONFLICT) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Conflict',
          type: problemTypes.conflict,
        });
      }

      if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Payload too large',
          type: problemTypes.payloadTooLarge,
        });
      }

      if (status === HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Unsupported media type',
          type: problemTypes.unsupportedMediaType,
        });
      }

      if (status === HttpStatus.TOO_MANY_REQUESTS) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'warn',
          shouldReport: false,
          status,
          title: 'Rate limit exceeded',
          type: problemTypes.tooManyRequests,
        });
      }

      if (status === HttpStatus.SERVICE_UNAVAILABLE) {
        return this.buildResult({
          context,
          detail,
          logLevel: 'error',
          shouldReport: true,
          status,
          title: 'Service unavailable',
          type: problemTypes.dependencyFailure,
        });
      }

      return this.buildResult({
        context,
        detail,
        logLevel: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'warn',
        shouldReport: status >= HttpStatus.INTERNAL_SERVER_ERROR,
        status,
        title: this.readHttpTitle(status),
        type:
          status >= HttpStatus.INTERNAL_SERVER_ERROR
            ? problemTypes.internalServerError
            : 'about:blank',
      });
    }

    return this.buildResult({
      context,
      detail: 'The server could not process the request.',
      logLevel: 'error',
      shouldReport: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      type: problemTypes.internalServerError,
    });
  }

  private buildResult(input: {
    readonly context: ProblemDetailsContext;
    readonly detail: string;
    readonly errors?: readonly ProblemDetailsErrorItem[];
    readonly logLevel: 'error' | 'warn';
    readonly shouldReport: boolean;
    readonly status: number;
    readonly title: string;
    readonly type: string;
  }): ProblemDetailsResult {
    const body: ProblemDetails = {
      detail: input.detail,
      instance: input.context.instance,
      status: input.status,
      title: input.title,
      traceId: input.context.traceId,
      type: input.type,
      ...(input.errors ? { errors: input.errors } : {}),
    };

    return {
      body,
      logLevel: input.logLevel,
      shouldReport: input.shouldReport,
      status: input.status,
    };
  }

  private isValidationException(exception: BadRequestException): boolean {
    const response = exception.getResponse();
    if (typeof response !== 'object' || response === null) {
      return false;
    }

    return Array.isArray((response as HttpExceptionResponseBody).message);
  }

  private readValidationErrors(exception: BadRequestException): readonly ProblemDetailsErrorItem[] {
    const response = exception.getResponse() as HttpExceptionResponseBody;
    if (Array.isArray(response.errors)) {
      return response.errors;
    }

    const message = response.message;
    if (!Array.isArray(message)) {
      return [];
    }

    return message.map((detail) => ({ detail: String(detail) }));
  }

  private readHttpDetail(exception: HttpException): string {
    if (exception.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'The server could not process the request.';
    }

    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const message = (response as HttpExceptionResponseBody).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }

    return this.readHttpTitle(exception.getStatus());
  }

  private readHttpTitle(status: number): string {
    if (status === HttpStatus.BAD_REQUEST) {
      return 'Bad request';
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      return 'Authentication failed';
    }

    if (status === HttpStatus.FORBIDDEN) {
      return 'Forbidden';
    }

    if (status === HttpStatus.NOT_FOUND) {
      return 'Resource not found';
    }

    if (status === HttpStatus.CONFLICT) {
      return 'Conflict';
    }

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      return 'Payload too large';
    }

    if (status === HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
      return 'Unsupported media type';
    }

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      return 'Rate limit exceeded';
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Internal server error';
    }

    return 'Request failed';
  }
}
