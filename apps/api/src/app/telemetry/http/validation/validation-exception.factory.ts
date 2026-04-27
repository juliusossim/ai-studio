import { BadRequestException, type ValidationError } from '@nestjs/common';
import { mapValidationErrors } from './validation-error.mapper';

export function createValidationException(errors: readonly ValidationError[]): BadRequestException {
  const mappedErrors = mapValidationErrors(errors);

  return new BadRequestException({
    errors: mappedErrors,
    message: mappedErrors.map((error) => `${error.field}: ${error.detail}`),
    statusCode: 400,
  });
}
