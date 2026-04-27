import { Badge } from '@org/ui-primitives';
import { MapPin } from 'lucide-react';
import type { ReactElement } from 'react';
import { TruncatedText } from '../../../typography';
import { PropertyCardPriceBlock } from './property-card-price-block';
import type { PropertyCardItem } from '../property-card.types';

export function PropertyCardBody({
  listing,
}: Readonly<{ listing: PropertyCardItem }>): ReactElement {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <PropertyCardPriceBlock listing={listing} />
          <TruncatedText
            className="mt-1 text-xl font-medium text-white"
            showTooltip
            text={listing.title}
            variant="h4"
          />
        </div>

        {listing.statusLabel ? (
          <Badge className="shrink-0 rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
            {listing.statusLabel}
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-sm text-white/62">
        <MapPin className="h-4 w-4" />
        <span>{listing.locationLabel}</span>
      </div>
      {listing.description ? (
        <TruncatedText
          className="text-sm leading-6 text-white/72"
          lineClamp={3}
          showTooltip={false}
          text={listing.description}
          variant="body2"
        />
      ) : null}
    </div>
  );
}
