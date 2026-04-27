import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { FieldWrapper } from '../field-wrapper';
import { FormSearchableSelectItem } from './searchable-select-item';
import type {
  SearchableMultipleSelectProps,
  SearchableSelectItem as SearchableSelectItemType,
} from './searchable-select.types';
import { findSelectedItems, flattenSearchableSelectOptions } from './searchable-select.utils';

export function FormSearchableSelectMultiple(
  props: Readonly<SearchableMultipleSelectProps>,
): ReactElement {
  const anchor = useComboboxAnchor();
  const items = flattenSearchableSelectOptions(props.options);

  return (
    <FieldWrapper
      description={props.description}
      label={props.label}
      name={props.name}
      required={props.required}
    >
      {(field) => {
        const selectedItems = findSelectedItems(
          props.options,
          Array.isArray(field.value) ? field.value : [],
        );

        return (
          <Combobox
            autoHighlight={props.highlight}
            disabled={props.disabled}
            isItemEqualToValue={(item, value) => item.value === value.value}
            items={items}
            multiple
            onValueChange={(values) => {
              field.onChange(values.map((value) => value.value));
              field.onBlur();
            }}
            required={props.required}
            value={selectedItems}
          >
            <ComboboxChips className="w-full" ref={anchor}>
              <ComboboxValue placeholder={props.placeholder}>
                {(values) => (
                  <>
                    {values.map((value: SearchableSelectItemType) => (
                      <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      disabled={props.disabled}
                      onBlur={field.onBlur}
                      placeholder={props.placeholder}
                      required={props.required}
                    />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>{props.emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(item: SearchableSelectItemType) => (
                  <ComboboxItem disabled={item.disabled} key={item.value} value={item}>
                    <FormSearchableSelectItem item={item} />
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldWrapper>
  );
}
