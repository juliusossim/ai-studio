import {
  Button,
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  InputGroupAddon,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { FieldWrapper } from '../field-wrapper';
import { FormSearchableSelectItem } from './searchable-select-item';
import type {
  SearchableGroupedSelectProps,
  SearchableSelectGroup as SearchableSelectGroupType,
  SearchableSelectItem as SearchableSelectItemType,
} from './searchable-select.types';
import { findSelectedItem } from './searchable-select.utils';

export function FormSearchableSelectGroup({
  options,
  ...props
}: Readonly<SearchableGroupedSelectProps>): ReactElement {
  return (
    <FieldWrapper
      description={props.description}
      label={props.label}
      name={props.name}
      required={props.required}
    >
      {(field) => {
        const selectedItem = findSelectedItem(
          options,
          typeof field.value === 'string' ? field.value : null,
        );

        return (
          <Combobox
            autoHighlight={props.highlight}
            disabled={props.disabled}
            isItemEqualToValue={(item, value) => item.value === value.value}
            itemToStringValue={(item: SearchableSelectItemType) => item.value}
            items={options}
            onValueChange={(value) => {
              field.onChange(value?.value ?? '');
              field.onBlur();
            }}
            value={selectedItem}
          >
            {!props.popup ? (
              <ComboboxInput
                disabled={props.disabled}
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

            <ComboboxContent alignOffset={-28} className="w-60">
              {props.popup ? (
                <ComboboxInput
                  disabled={props.disabled}
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
                {(group: SearchableSelectGroupType) => (
                  <ComboboxGroup items={group.items} key={group.label}>
                    <ComboboxLabel>{group.label}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item: SearchableSelectItemType) => (
                        <ComboboxItem disabled={item.disabled} key={item.value} value={item}>
                          <FormSearchableSelectItem item={item} />
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldWrapper>
  );
}
