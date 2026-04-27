import type * as LabelPrimitive from '@radix-ui/react-label';
import type { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef } from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

export type UseFormFieldResult = Readonly<{
  id: string;
  name: FieldPath<FieldValues>;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  error?: {
    message?: string;
  };
}>;

export type FormItemContextValue = {
  id: string;
};

export type FormItemProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type FormLabelProps = Readonly<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>;
export type FormControlProps = Readonly<ComponentPropsWithoutRef<typeof Slot>>;
export type FormDescriptionProps = Readonly<ComponentPropsWithoutRef<'p'>>;
export type FormMessageProps = Readonly<ComponentPropsWithoutRef<'p'>>;
