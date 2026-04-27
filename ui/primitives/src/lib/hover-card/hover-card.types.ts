import type * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import type { ComponentPropsWithoutRef } from 'react';

export type HoverCardProps = Readonly<ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>>;

export type HoverCardTriggerProps = Readonly<
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>;

export type HoverCardContentProps = Readonly<
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>;
