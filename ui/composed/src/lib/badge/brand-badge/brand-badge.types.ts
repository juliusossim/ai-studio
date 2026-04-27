import type { KeyboardEvent, ReactNode } from 'react';
import type { BadgeVariant } from '@org/ui-primitives';

export type BrandBadgeItem = Readonly<{
  id: string;
  name: string;
  description?: string;
  href?: string;
  logoUrl?: string;
  logo?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  className?: string;
}>;

export type BrandBadgeProps = Readonly<{
  brand: BrandBadgeItem;
  variant?: BadgeVariant;
  clickable?: boolean;
  onClick?: (brand: BrandBadgeItem) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>, brand: BrandBadgeItem) => void;
}>;
