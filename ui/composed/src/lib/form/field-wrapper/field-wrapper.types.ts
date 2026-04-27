import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import type { ReactNode } from 'react';

export type FieldWrapperProps<TFieldValues extends FieldValues = FieldValues> = Readonly<{
  name: Path<TFieldValues>;
  children: (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>) => ReactNode;
  label?: string;
  description?: string;
  required?: boolean;
}>;
