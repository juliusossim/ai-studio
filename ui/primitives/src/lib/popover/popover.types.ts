import type * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentPropsWithoutRef, ComponentRef } from 'react';

export type PopoverProps = Readonly<ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>>;

export type PopoverTriggerProps = Readonly<
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>;

export type PopoverAnchorProps = Readonly<ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>>;

export type PopoverContentRef = ComponentRef<typeof PopoverPrimitive.Content>;

export type PopoverContentProps = Readonly<
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>;
