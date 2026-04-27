import { Prisma } from '@prisma/client';
import { translatePrismaException } from './prisma-exception.mapper';
import { DependencyFailureException } from '../errors/dependency-failure.exception';
import { InternalOperationException } from '../errors/internal-operation.exception';
import { ResourceConflictException } from '../errors/resource-conflict.exception';
import { ResourceNotFoundException } from '../errors/resource-not-found.exception';

describe('prisma-exception mapper', () => {
  it('maps unique constraint errors to a conflict exception', () => {
    const error = createKnownRequestError('P2002');

    expect(
      translatePrismaException(error, {
        conflictDetail: 'An account already exists for this email address.',
      }),
    ).toEqual(expect.any(ResourceConflictException));
  });

  it('maps missing record errors to a not found exception', () => {
    const error = createKnownRequestError('P2025');

    expect(
      translatePrismaException(error, {
        notFoundDetail: 'Property was not found.',
      }),
    ).toEqual(expect.any(ResourceNotFoundException));
  });

  it('maps connection pressure errors to a dependency failure exception', () => {
    const error = createKnownRequestError('P2037');

    expect(translatePrismaException(error, {})).toEqual(expect.any(DependencyFailureException));
  });

  it('maps prisma validation errors to an internal operation exception', () => {
    const error = createPrismaValidationError();

    expect(translatePrismaException(error, {})).toEqual(expect.any(InternalOperationException));
  });
});

function createKnownRequestError(code: string): Prisma.PrismaClientKnownRequestError {
  const error = Object.create(
    Prisma.PrismaClientKnownRequestError.prototype,
  ) as Prisma.PrismaClientKnownRequestError;
  Object.assign(error, {
    clientVersion: 'test',
    code,
    meta: {},
    message: 'Known prisma request error',
    name: 'PrismaClientKnownRequestError',
  });

  return error;
}

function createPrismaValidationError(): Prisma.PrismaClientValidationError {
  const error = Object.create(
    Prisma.PrismaClientValidationError.prototype,
  ) as Prisma.PrismaClientValidationError;
  Object.assign(error, {
    clientVersion: 'test',
    message: 'Validation error',
    name: 'PrismaClientValidationError',
  });

  return error;
}
