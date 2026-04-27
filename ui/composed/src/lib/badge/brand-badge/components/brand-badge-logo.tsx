import { Avatar, AvatarFallback, AvatarImage } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { BrandBadgeItem } from '../brand-badge.types';

export function BrandBadgeLogo({
  brand,
}: Readonly<{ brand: Readonly<BrandBadgeItem> }>): ReactElement | null {
  const logoSrc = brand.logoUrl ?? brand.logo;

  if (!logoSrc) {
    return null;
  }

  return (
    <Avatar>
      <AvatarImage alt={brand.name} src={logoSrc} />
      <AvatarFallback>Logo</AvatarFallback>
    </Avatar>
  );
}
