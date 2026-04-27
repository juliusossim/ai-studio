import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef } from 'react';

export type DialogProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Root>>;

export type DialogTriggerProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>>;

export type DialogPortalProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>>;

export type DialogCloseProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Close>>;

export type DialogOverlayProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>;

export type DialogContentProps = Readonly<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlayClassName?: string;
    showCloseButton?: boolean;
  }
>;

export type DialogHeaderProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type DialogFooterProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    showCloseButton?: boolean;
  }
>;

export type DialogTitleProps = Readonly<ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>;

export type DialogDescriptionProps = Readonly<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>;
