import { Item, ItemContent, ItemDescription, ItemMedia } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { SearchableSelectItem as SearchableSelectItemType } from './searchable-select.types';

export type FormSearchableSelectItemProps = Readonly<{
  item: SearchableSelectItemType;
}>;

export function FormSearchableSelectItem({
  item,
}: Readonly<FormSearchableSelectItemProps>): ReactElement {
  return (
    <Item className="flex flex-col items-baseline gap-0" key={item.value} size="sm">
      <ItemContent className="flex flex-row gap-0.5 p-0">
        {item.icon ? <ItemMedia>{item.icon}</ItemMedia> : null}
        {item.label}
      </ItemContent>
      {item.description ? <ItemDescription>{item.description}</ItemDescription> : null}
    </Item>
  );
}
