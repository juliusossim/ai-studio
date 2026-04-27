import z from 'zod';
import { ValidationMessages } from './validation-messages';

export const CommonSchemas = {
  email: () =>
    z.string().min(1, ValidationMessages.required('Email')).email(ValidationMessages.email),
  password: (options?: Readonly<{ minLength?: number; maxLength?: number }>) =>
    z
      .string()
      .min(
        options?.minLength ?? 8,
        ValidationMessages.minLength('Password', options?.minLength ?? 8),
      )
      .max(
        options?.maxLength ?? 100,
        ValidationMessages.maxLength('Password', options?.maxLength ?? 100),
      ),
  strongPassword: () =>
    z
      .string()
      .min(8, ValidationMessages.minLength('Password', 8))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  phoneNumber: () =>
    z
      .string()
      .min(1, ValidationMessages.required('Phone number'))
      .regex(/^\+?[\d\s-()]+$/, ValidationMessages.phoneNumber),
  url: () => z.string().min(1, ValidationMessages.required('URL')).url(ValidationMessages.url),
  requiredString: (fieldName: string, options?: Readonly<{ min?: number; max?: number }>) =>
    z
      .string()
      .min(1, ValidationMessages.required(fieldName))
      .min(
        options?.min ?? 1,
        options?.min ? ValidationMessages.minLength(fieldName, options.min) : '',
      )
      .max(options?.max ?? 1000, ValidationMessages.maxLength(fieldName, options?.max ?? 1000)),
  optionalString: (options?: Readonly<{ min?: number; max?: number }>) =>
    z
      .string()
      .optional()
      .refine(
        (value) => !value || value.length >= (options?.min ?? 0),
        options?.min ? ValidationMessages.minLength('Field', options.min) : '',
      )
      .refine(
        (value) => !value || value.length <= (options?.max ?? 1000),
        options?.max ? ValidationMessages.maxLength('Field', options.max) : '',
      ),
  positiveNumber: (fieldName: string) =>
    z
      .number({
        message: ValidationMessages.required(fieldName),
      })
      .positive(ValidationMessages.positiveNumber),
  date: (fieldName: string) =>
    z.date({
      message: ValidationMessages.required(fieldName),
    }),
  futureDate: (fieldName: string) =>
    z
      .date({
        message: ValidationMessages.required(fieldName),
      })
      .refine((date) => date > new Date(), ValidationMessages.futureDate),
  pastDate: (fieldName: string) =>
    z
      .date({
        message: ValidationMessages.required(fieldName),
      })
      .refine((date) => date < new Date(), ValidationMessages.pastDate),
} as const;
