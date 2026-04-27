import type { ReactElement, ReactNode } from 'react';
import type { BrandBadgeItem } from '../brand-badge.types';

export function BrandBadgeIcon({
  brand,
  position,
}: Readonly<{
  brand: Readonly<BrandBadgeItem>;
  position: NonNullable<BrandBadgeItem['iconPosition']>;
}>): ReactElement | ReactNode | null {
  if (brand.iconPosition !== position) {
    return null;
  }

  return brand.icon ?? null;
}
