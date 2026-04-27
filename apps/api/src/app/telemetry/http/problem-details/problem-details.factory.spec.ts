import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProblemDetailsFactory } from './problem-details.factory';

describe('ProblemDetailsFactory', () => {
  const factory = new ProblemDetailsFactory();
  const context = {
    instance: '/api/test',
    traceId: 'trace-123',
  };

  it('maps validation errors to problem details', () => {
    const exception = new BadRequestException({
      errors: [{ detail: 'email must be an email', field: 'email' }],
      message: ['email: email must be an email'],
      statusCode: 400,
    });

    expect(factory.create(exception, context)).toEqual({
      body: {
        detail: 'One or more request fields are invalid.',
        errors: [{ detail: 'email must be an email', field: 'email' }],
        instance: '/api/test',
        status: 400,
        title: 'Request validation failed',
        traceId: 'trace-123',
        type: 'https://api.ripples.app/problems/validation-error',
      },
      logLevel: 'warn',
      shouldReport: false,
      status: 400,
    });
  });

  it('maps authentication errors without reporting them', () => {
    const result = factory.create(new UnauthorizedException('Missing bearer token.'), context);

    expect(result.body.title).toBe('Authentication failed');
    expect(result.body.detail).toBe('Missing bearer token.');
    expect(result.shouldReport).toBe(false);
  });

  it('maps unexpected exceptions to a generic internal server error', () => {
    const result = factory.create(new InternalServerErrorException('Database offline'), context);

    expect(result).toEqual({
      body: {
        detail: 'The server could not process the request.',
        instance: '/api/test',
        status: 500,
        title: 'Internal server error',
        traceId: 'trace-123',
        type: 'https://api.ripples.app/problems/internal-server-error',
      },
      logLevel: 'error',
      shouldReport: true,
      status: 500,
    });
  });
});
