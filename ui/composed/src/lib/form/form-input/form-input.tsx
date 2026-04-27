import { Input, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { FieldWrapper } from '../field-wrapper';
import type { FormInputProps } from './form-input.types';

export function FormInput({
  name,
  label,
  description,
  required,
  className,
  ...props
}: Readonly<FormInputProps>): ReactElement {
  return (
    <FieldWrapper description={description} label={label} name={name} required={required}>
      {(field) => {
        const { ref: fieldRef, ...fieldProps } = field;

        return <Input {...fieldProps} {...props} className={cn(className)} ref={fieldRef} />;
      }}
    </FieldWrapper>
  );
}
