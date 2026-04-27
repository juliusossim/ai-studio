import type { ValidationError } from '@nestjs/common';
import { createValidationException } from './validation-exception.factory';
import { mapValidationErrors } from './validation-error.mapper';

describe('validation-error mapper', () => {
  it('flattens nested validation errors with dot-separated field paths', () => {
    const errors: ValidationError[] = [
      {
        children: [
          {
            children: [],
            constraints: {
              isString: 'city must be a string',
            },
            property: 'city',
          } as ValidationError,
        ],
        constraints: undefined,
        property: 'location',
      } as ValidationError,
    ];

    expect(mapValidationErrors(errors)).toEqual([
      {
        detail: 'city must be a string',
        field: 'location.city',
      },
    ]);
  });

  it('creates a bad request exception with structured errors', () => {
    const errors: ValidationError[] = [
      {
        children: [],
        constraints: {
          isUuid: 'id must be a UUID',
        },
        property: 'id',
      } as ValidationError,
    ];

    expect(createValidationException(errors).getResponse()).toEqual({
      errors: [
        {
          detail: 'id must be a UUID',
          field: 'id',
        },
      ],
      message: ['id: id must be a UUID'],
      statusCode: 400,
    });
  });
});
