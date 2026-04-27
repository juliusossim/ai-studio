import type { Ref } from 'react';
import z from 'zod';
import { CommonSchemas } from './common-schema-builders';
import { ValidationMessages } from './validation-messages';

export function createPasswordConfirmationSchema(): z.ZodType<{
  password: string;
  confirmPassword: string;
}> {
  return z
    .object({
      password: CommonSchemas.password(),
      confirmPassword: z.string().min(1, ValidationMessages.required('Confirm Password')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: ValidationMessages.passwordMatch,
      path: ['confirmPassword'],
    });
}

export const stringToNumber = z
  .string()
  .transform((value) => (value === '' ? undefined : Number(value)))
  .pipe(z.number().optional());

export const stringToDate = z
  .string()
  .transform((value) => (value === '' ? undefined : new Date(value)))
  .pipe(z.date().optional());

export function extractZodErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((accumulator, issue) => {
    const path = issue.path.join('.');
    return {
      ...accumulator,
      [path]: issue.message,
    };
  }, {});
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    const mutableRef = ref;
    mutableRef.current = node;
  }
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node: T | null): void => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}
