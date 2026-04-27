import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  InputGroupAddon,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { FieldWrapper } from '../field-wrapper';
import { FormSearchableSelectItem } from './searchable-select-item';
import type {
  SearchableBasicSelectProps,
  SearchableSelectItem as SearchableSelectItemType,
} from './searchable-select.types';
import { findSelectedItem, flattenSearchableSelectOptions } from './searchable-select.utils';

export function FormSearchableSelectBasic(
  props: Readonly<SearchableBasicSelectProps>,
): ReactElement {
  const items = flattenSearchableSelectOptions(props.options);

  return (
    <FieldWrapper
      description={props.description}
      label={props.label}
      name={props.name}
      required={props.required}
    >
      {(field) => {
        const selectedItem = findSelectedItem(
          props.options,
          typeof field.value === 'string' ? field.value : null,
        );

        return (
          <Combobox
            autoHighlight={props.highlight}
            disabled={props.disabled}
            isItemEqualToValue={(item, value) =>
              item?.value !== undefined && value?.value !== undefined
                ? item.value === value.value
                : false
            }
            itemToStringValue={(item?: SearchableSelectItemType) => item?.value ?? ''}
            items={items}
            onValueChange={(value) => {
              field.onChange(value?.value ?? '');
              field.onBlur();
            }}
            value={selectedItem}
          >
            {!props.popup ? (
              <ComboboxInput
                onBlur={field.onBlur}
                placeholder={props.placeholder}
                required={props.required}
                showClear={props.showClear}
                showTrigger={false}
              >
                {props.icon ? (
                  <InputGroupAddon align={props.iconPosition}>{props.icon}</InputGroupAddon>
                ) : null}
              </ComboboxInput>
            ) : null}

            {props.popup ? (
              <ComboboxTrigger
                render={
                  <Button className="w-full justify-between font-normal" variant="outline">
                    <ComboboxValue placeholder={props.placeholder} />
                  </Button>
                }
              />
            ) : null}

            <ComboboxContent>
              {props.popup ? (
                <ComboboxInput
                  onBlur={field.onBlur}
                  placeholder={props.placeholder}
                  required={props.required}
                  showClear={props.showClear}
                  showTrigger={false}
                >
                  {props.icon ? (
                    <InputGroupAddon align={props.iconPosition}>{props.icon}</InputGroupAddon>
                  ) : null}
                </ComboboxInput>
              ) : null}

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
