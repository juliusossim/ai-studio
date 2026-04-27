import type { ReactElement } from 'react';
import { Amount } from '../../../amount';
import type { PropertyCardItem } from '../property-card.types';

export function PropertyCardPriceBlock({
  listing,
}: Readonly<{ listing: PropertyCardItem }>): ReactElement | null {
  if (listing.amount) {
    return (
      <Amount
        {...listing.amount}
        className="gap-3"
        valueClassName="text-2xl font-semibold text-amber-200"
      />
    );
  }

  if (listing.priceLabel) {
    return <p className="text-2xl font-semibold text-amber-200">{listing.priceLabel}</p>;
  }

  return null;
}
