import type * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { ComponentPropsWithoutRef } from 'react';

export type AvatarSize = 'default' | 'sm' | 'lg';

export type AvatarProps = Readonly<
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: AvatarSize;
  }
>;

export type AvatarImageProps = Readonly<ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>;

export type AvatarFallbackProps = Readonly<
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>;

export type AvatarBadgeProps = Readonly<ComponentPropsWithoutRef<'span'>>;
export type AvatarGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type AvatarGroupCountProps = Readonly<ComponentPropsWithoutRef<'div'>>;
