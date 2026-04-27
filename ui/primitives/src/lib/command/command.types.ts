import type { Command as CommandPrimitive } from 'cmdk';
import type { ComponentPropsWithoutRef } from 'react';
import type { DialogProps } from '../dialog/dialog.types';

export type CommandProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive>>;

export type CommandDialogProps = Readonly<
  DialogProps & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
  }
>;

export type CommandInputProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>;

export type CommandListProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive.List>>;

export type CommandEmptyProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>>;

export type CommandGroupProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive.Group>>;

export type CommandSeparatorProps = Readonly<
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>;

export type CommandItemProps = Readonly<ComponentPropsWithoutRef<typeof CommandPrimitive.Item>>;

export type CommandShortcutProps = Readonly<ComponentPropsWithoutRef<'span'>>;
