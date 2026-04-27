import { Prisma } from '@prisma/client';
import { DependencyFailureException } from '../errors/dependency-failure.exception';
import { InternalOperationException } from '../errors/internal-operation.exception';
import { ResourceConflictException } from '../errors/resource-conflict.exception';
import { ResourceNotFoundException } from '../errors/resource-not-found.exception';

export interface PrismaExceptionContext {
  readonly conflictDetail?: string;
  readonly dependencyDetail?: string;
  readonly notFoundDetail?: string;
}

export async function executePrismaOperation<T>(
  operation: () => Promise<T>,
  context: Readonly<PrismaExceptionContext>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw translatePrismaException(error, context);
  }
}

export function translatePrismaException(
  error: unknown,
  context: Readonly<PrismaExceptionContext>,
): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return new ResourceConflictException(
        context.conflictDetail ?? 'The request conflicts with an existing record.',
      );
    }

    if (
      error.code === 'P2001' ||
      error.code === 'P2015' ||
      error.code === 'P2018' ||
      error.code === 'P2025'
    ) {
      return new ResourceNotFoundException(
        context.notFoundDetail ?? 'The requested resource was not found.',
      );
    }

    if (
      error.code === 'P2003' ||
      error.code === 'P2004' ||
      error.code === 'P2014' ||
      error.code === 'P2017'
    ) {
      return new ResourceConflictException(
        context.conflictDetail ?? 'The request conflicts with related data.',
      );
    }

    if (error.code === 'P2024' || error.code === 'P2034' || error.code === 'P2037') {
      return new DependencyFailureException(
        context.dependencyDetail ?? 'The database is temporarily unavailable.',
      );
    }

    return new InternalOperationException();
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return new DependencyFailureException(
      context.dependencyDetail ?? 'The database is temporarily unavailable.',
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new InternalOperationException();
  }

  return error instanceof Error ? error : new InternalOperationException();
}
