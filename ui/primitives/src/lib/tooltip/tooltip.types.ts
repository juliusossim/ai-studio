import type * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithoutRef } from 'react';

export type TooltipProviderProps = Readonly<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
>;

export type TooltipProps = Readonly<ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>>;

export type TooltipTriggerProps = Readonly<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>;

export type TooltipContentProps = Readonly<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>;
