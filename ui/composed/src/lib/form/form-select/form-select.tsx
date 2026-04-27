import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import { composeRefs } from '../utils';
import { FieldWrapper } from '../field-wrapper';
import type { FormSelectGroup, FormSelectOption, FormSelectProps } from './form-select.types';

function isFormSelectGroup(option: FormSelectOption): option is FormSelectGroup {
  return 'items' in option;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(function FormSelect(
  { name, label, description, required, options, placeholder, className, ...props },
  ref,
): ReactElement {
  return (
    <FieldWrapper description={description} label={label} name={name} required={required}>
      {(field) => {
        const { ref: fieldRef, ...fieldProps } = field;

        return (
          <select
            {...fieldProps}
            {...props}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            ref={composeRefs(fieldRef, ref)}
          >
            {placeholder ? (
              <option disabled value="">
                {placeholder}
              </option>
            ) : null}
            {options.map((option) =>
              isFormSelectGroup(option) ? (
                <optgroup key={option.label} label={option.label}>
                  {option.items.map((item) => (
                    <option disabled={item.disabled} key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option disabled={option.disabled} key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        );
      }}
    </FieldWrapper>
  );
});
