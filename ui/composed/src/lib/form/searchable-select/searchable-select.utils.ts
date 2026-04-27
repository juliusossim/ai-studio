import type {
  SearchableSelectGroup,
  SearchableSelectItem,
  SearchableSelectOption,
} from './searchable-select.types';

export function isSearchableSelectGroup(
  option: SearchableSelectOption,
): option is SearchableSelectGroup {
  return 'items' in option;
}

export function flattenSearchableSelectOptions(
  options: readonly SearchableSelectOption[],
): SearchableSelectItem[] {
  return options.flatMap((option) =>
    isSearchableSelectGroup(option) ? [...option.items] : option,
  );
}

export function findSelectedItem(
  options: readonly SearchableSelectOption[],
  value: string | null | undefined,
): SearchableSelectItem | null {
  if (!value) {
    return null;
  }

  return flattenSearchableSelectOptions(options).find((item) => item.value === value) ?? null;
}

export function findSelectedItems(
  options: readonly SearchableSelectOption[],
  values: readonly string[] | null | undefined,
): SearchableSelectItem[] {
  if (!values?.length) {
    return [];
  }

  const itemsByValue = new Map(
    flattenSearchableSelectOptions(options).map((item) => [item.value, item]),
  );

  return values
    .map((value) => itemsByValue.get(value))
    .filter((item): item is SearchableSelectItem => item !== undefined);
}
