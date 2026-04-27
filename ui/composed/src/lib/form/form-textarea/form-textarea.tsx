import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormTextareaProps } from './form-textarea.types';

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea({ name, label, description, required, ...props }, ref): ReactElement {
    const form = useFormContext();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label ? (
              <FormLabel>
                {label}
                {required ? <span className="ml-1 text-destructive">*</span> : null}
              </FormLabel>
            ) : null}
            <FormControl>
              <Textarea {...field} {...props} ref={ref} />
            </FormControl>
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);
