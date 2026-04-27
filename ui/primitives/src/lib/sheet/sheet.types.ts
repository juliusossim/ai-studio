import type * as SheetPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef } from 'react';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export type SheetProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Root>>;

export type SheetTriggerProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>>;

export type SheetCloseProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Close>>;

export type SheetPortalProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>>;

export type SheetOverlayProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>;

export type SheetContentProps = Readonly<
  ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: SheetSide;
  }
>;

export type SheetHeaderProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SheetFooterProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SheetTitleProps = Readonly<ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>;
export type SheetDescriptionProps = Readonly<
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>;
