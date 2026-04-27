import type { ReactElement } from 'react';
import { Caption } from '../../../typography';
import type { BrandBadgeItem } from '../brand-badge.types';

export function BrandBadgeTitle({
  brand,
}: Readonly<{ brand: Readonly<BrandBadgeItem> }>): ReactElement {
  if (brand.href) {
    return <a href={brand.href}>{brand.name}</a>;
  }

  return <Caption className={brand.className}>{brand.name}</Caption>;
}
