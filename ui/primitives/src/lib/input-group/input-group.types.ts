import type { ComponentPropsWithoutRef } from 'react';
import type { ButtonProps } from '../button';

export type InputGroupAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

export type InputGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type InputGroupAddonProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    align?: InputGroupAlign;
  }
>;

export type InputGroupButtonProps = Readonly<
  Omit<ButtonProps, 'size'> & {
    size?: InputGroupButtonSize;
  }
>;

export type InputGroupTextProps = Readonly<ComponentPropsWithoutRef<'span'>>;
export type InputGroupInputProps = Readonly<ComponentPropsWithoutRef<'input'>>;
export type InputGroupTextareaProps = Readonly<ComponentPropsWithoutRef<'textarea'>>;
