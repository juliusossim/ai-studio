import type { ReactNode, SelectHTMLAttributes } from 'react';

export type FormSelectItem = Readonly<{
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}>;

export type FormSelectGroup = Readonly<{
  label: string;
  items: readonly FormSelectItem[];
}>;

export type FormSelectOption = FormSelectItem | FormSelectGroup;

export type FormSelectIconPosition = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

export type FormSelectBaseProps = Readonly<{
  name: string;
  options: readonly FormSelectOption[];
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  iconPosition?: FormSelectIconPosition;
  emptyText?: string;
  popup?: boolean;
  showClear?: boolean;
  highlight?: boolean;
}>;

export type FormSelectProps = Readonly<
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> &
    FormSelectBaseProps & {
      multiple?: false;
      popup?: false;
      showClear?: false;
      highlight?: false;
      emptyText?: never;
    }
>;

export type FormSearchableGroupedSelectProps = FormSelectBaseProps &
  Readonly<{
    grouped: true;
    multiple?: false;
  }>;

export type FormSearchableMultipleSelectProps = FormSelectBaseProps &
  Readonly<{
    multiple: true;
    grouped?: false;
    popup?: false;
  }>;

export type FormSearchableBasicSelectProps = FormSelectBaseProps &
  Readonly<{
    multiple?: false;
    grouped?: false;
  }>;

export type FormSearchableSelectProps =
  | FormSearchableBasicSelectProps
  | FormSearchableGroupedSelectProps
  | FormSearchableMultipleSelectProps;
