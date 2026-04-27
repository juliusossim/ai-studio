import type { ReactElement, ReactNode } from 'react';
import { Button, Input } from '@org/ui-primitives';
import { FormProvider, useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import { FieldWrapper } from './field-wrapper';

export const basicSelectOptions = [
  { label: 'Accra', value: 'accra' },
  { label: 'Cape Town', value: 'cape-town' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'Nairobi', value: 'nairobi', disabled: true },
] as const;

export const groupedSelectOptions = [
  {
    label: 'Residential',
    items: [
      { label: 'Apartment', value: 'apartment' },
      { label: 'Penthouse', value: 'penthouse' },
      { label: 'Townhouse', value: 'townhouse' },
    ],
  },
  {
    label: 'Commercial',
    items: [
      { label: 'Retail', value: 'retail' },
      { label: 'Office', value: 'office' },
      { label: 'Warehouse', value: 'warehouse', disabled: true },
    ],
  },
] as const;

export const multiSelectOptions = [
  { label: 'Roof deck', value: 'roof-deck' },
  { label: 'Concierge', value: 'concierge' },
  { label: 'Private gym', value: 'private-gym' },
  { label: 'Co-working lounge', value: 'coworking' },
  { label: 'EV charging', value: 'ev-charging' },
] as const;

export function FormStoryShell<TFieldValues extends FieldValues>({
  children,
  defaultValues,
}: Readonly<{
  children: ReactNode;
  defaultValues: UseFormProps<TFieldValues>['defaultValues'];
}>): ReactElement {
  const form = useForm<TFieldValues>({
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5 rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void form.trigger();
        }}
      >
        {children}
        <Button type="submit" variant="outline">
          Validate field
        </Button>
      </form>
    </FormProvider>
  );
}

export function StoryPanel({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <div className="max-w-xl bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">
      {children}
    </div>
  );
}

export function FieldWrapperShowcase(): ReactElement {
  return (
    <FieldWrapper
      description="This helper wraps label, description, and validation state around custom controls."
      label="Custom passcode"
      name="passcode"
      required
    >
      {(field) => <Input {...field} placeholder="Enter six-digit passcode" />}
    </FieldWrapper>
  );
}
