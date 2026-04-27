import type { ReactElement } from 'react';
import { FormSearchableSelectBasic } from './searchable-select-basic';
import { FormSearchableSelectGroup } from './searchable-select-group';
import { FormSearchableSelectMultiple } from './searchable-select-multiple';
import type { SearchableSelectProps } from './searchable-select.types';

export function FormSearchableSelect(props: Readonly<SearchableSelectProps>): ReactElement {
  if ('multiple' in props && props.multiple) {
    return <FormSearchableSelectMultiple {...props} />;
  }

  if ('grouped' in props && props.grouped) {
    return <FormSearchableSelectGroup {...props} />;
  }

  return <FormSearchableSelectBasic {...props} />;
}
