import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { containsControlCharacters } from '@org/utils';

export function NoControlCharacters(validationOptions?: ValidationOptions): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'NoControlCharacters',
      target: target.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === undefined || value === null) {
            return true;
          }

          return typeof value === 'string' && !containsControlCharacters(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must not contain control characters.`;
        },
      },
    });
  };
}
