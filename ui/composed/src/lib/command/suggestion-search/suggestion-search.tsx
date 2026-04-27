import { CommandGroup, CommandItem } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { CommandWrapper } from '../command-wrapper';
import type { SuggestionSearchProps } from './suggestion-search.types';

export function SuggestionSearch({
  open,
  onOpenChange,
  groups,
  placeholder,
  trigger,
  emptyText,
  title,
  description,
}: Readonly<SuggestionSearchProps>): ReactElement {
  return (
    <CommandWrapper
      description={description}
      emptyText={emptyText}
      open={open}
      openChange={onOpenChange}
      placeholder={placeholder}
      title={title}
      trigger={trigger}
    >
      {groups.map((group) => (
        <CommandGroup key={group.id} heading={group.title}>
          <div className="flex flex-col gap-2">
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                keywords={item.keywords ? [...item.keywords] : undefined}
                onSelect={item.onSelect}
                value={item.title}
              >
                {item.icon}
                <div className="ml-2">
                  <div>{item.title}</div>
                  {item.description ? (
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  ) : null}
                </div>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      ))}
    </CommandWrapper>
  );
}
