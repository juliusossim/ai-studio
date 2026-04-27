import type { ValidationError } from '@nestjs/common';

export interface ValidationErrorDetail {
  readonly detail: string;
  readonly field: string;
}

export function mapValidationErrors(
  errors: readonly ValidationError[],
): readonly ValidationErrorDetail[] {
  return errors.flatMap((error) => flattenValidationError(error));
}

function flattenValidationError(
  error: ValidationError,
  parentPath?: string,
): readonly ValidationErrorDetail[] {
  const field = parentPath ? `${parentPath}.${error.property}` : error.property;
  const ownErrors = Object.values(error.constraints ?? {}).map((detail) => ({
    detail,
    field,
  }));
  const childErrors = (error.children ?? []).flatMap((child) =>
    flattenValidationError(child, field),
  );

  return [...ownErrors, ...childErrors];
}
