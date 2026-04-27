import { ButtonGroup, InputGroup, InputGroupButton, InputGroupInput, cn } from '@org/ui-primitives';
import { Search, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { forwardRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { composeRefs } from '../utils';
import { FieldWrapper } from '../field-wrapper';
import type { SearchInputProps } from './search-input.types';

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    clearButtonLabel = 'Clear search',
    description,
    handleClear,
    inputGroupClassName,
    label,
    name,
    required,
    showClear = true,
    submitButtonLabel = 'Submit search',
    className,
    ...props
  },
  ref,
): ReactElement {
  const form = useFormContext();
  const onClear = useCallback((): void => {
    form.setValue(name, '', {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    handleClear?.();
  }, [form, handleClear, name]);

  return (
    <FieldWrapper description={description} label={label} name={name} required={required}>
      {(field) => {
        const { ref: fieldRef, ...fieldProps } = field;

        return (
          <InputGroup className={cn('bg-white px-1', inputGroupClassName)}>
            <InputGroupInput
              {...fieldProps}
              {...props}
              className={cn(
                'focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none',
                className,
              )}
              ref={composeRefs(fieldRef, ref)}
            />
            <ButtonGroup>
              {showClear && Boolean(field.value) ? (
                <InputGroupButton
                  aria-label={clearButtonLabel}
                  className="border-0"
                  onClick={onClear}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <X />
                </InputGroupButton>
              ) : null}
              <InputGroupButton
                aria-label={submitButtonLabel}
                className="border-0"
                size="icon-sm"
                type="submit"
                variant="ghost"
              >
                <Search className="text-black" />
              </InputGroupButton>
            </ButtonGroup>
          </InputGroup>
        );
      }}
    </FieldWrapper>
  );
});
