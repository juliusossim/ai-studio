import type { Combobox as ComboboxPrimitive } from '@base-ui/react';
import type { ComponentPropsWithRef, RefObject } from 'react';

export type ComboboxValueProps = Readonly<ComboboxPrimitive.Value.Props>;
export type ComboboxTriggerProps = Readonly<ComboboxPrimitive.Trigger.Props>;
export type ComboboxClearProps = Readonly<ComboboxPrimitive.Clear.Props>;

export type ComboboxInputProps = Readonly<
  ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
  }
>;

export type ComboboxContentProps = Readonly<
  ComboboxPrimitive.Popup.Props &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
    >
>;

export type ComboboxListProps = Readonly<ComboboxPrimitive.List.Props>;
export type ComboboxItemProps = Readonly<ComboboxPrimitive.Item.Props>;
export type ComboboxGroupProps = Readonly<ComboboxPrimitive.Group.Props>;
export type ComboboxLabelProps = Readonly<ComboboxPrimitive.GroupLabel.Props>;
export type ComboboxCollectionProps = Readonly<ComboboxPrimitive.Collection.Props>;
export type ComboboxEmptyProps = Readonly<ComboboxPrimitive.Empty.Props>;
export type ComboboxSeparatorProps = Readonly<ComboboxPrimitive.Separator.Props>;

export type ComboboxChipsProps = Readonly<
  ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props
>;

export type ComboboxChipProps = Readonly<
  ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean;
  }
>;

export type ComboboxChipsInputProps = Readonly<ComboboxPrimitive.Input.Props>;
export type UseComboboxAnchorResult = RefObject<HTMLDivElement | null>;
