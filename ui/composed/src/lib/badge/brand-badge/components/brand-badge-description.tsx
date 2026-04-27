import type { ReactElement, ReactNode } from 'react';
import { MoreInfoText, SmallText } from '../../../typography';
import type { BrandBadgeItem } from '../brand-badge.types';

export function BrandBadgeDescription({
  brand,
  title,
}: Readonly<{
  brand: Readonly<BrandBadgeItem>;
  title: ReactNode;
}>): ReactElement | ReactNode {
  if (!brand.description) {
    return title;
  }

  return (
    <MoreInfoText content={brand.description} title={title}>
      <SmallText className="text-xs text-indigo-400">{brand.description}</SmallText>
    </MoreInfoText>
  );
}
