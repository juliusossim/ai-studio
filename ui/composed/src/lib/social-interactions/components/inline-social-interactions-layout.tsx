import { Button, Item } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { ActionDef } from '../social-interactions.types';

export function InlineSocialInteractionsLayout({
  actions,
}: Readonly<{ actions: readonly ActionDef[] }>): ReactElement {
  return (
    <Item className="flex flex-row flex-nowrap">
      {actions.map((action) => (
        <div key={action.id} className="flex flex-col items-center gap-0.5">
          <Button
            className="cursor-pointer p-0"
            disabled={action.disabled}
            onClick={action.onClick}
            size="icon"
            variant="ghost"
          >
            {action.icon}
          </Button>
          <span className="text-xs text-muted-foreground">
            {action.value} {action.label}
          </span>
        </div>
      ))}
    </Item>
  );
}
