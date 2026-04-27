import { Button, Card, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { PropertyCarousel } from '../../carousel';
import { PropertyCardBody } from './proper-card-components/property-card-body';
import { PropertyCardHeader } from './proper-card-components/property-card-header';
import { PropertyCardStatsSection } from './proper-card-components/property-card-stats-section';
import { PropertyCardTags } from './proper-card-components/property-card-tags';
import { readPropertyTagBrands, resolvePropertyCardSettings } from './property-card.utils';
import type { PropertyCardProps } from './property-card.types';
import { usePropertyTagCarouselOverflow } from './use-property-tag-carousel-overflow';
export function PropertyCard({
  listing,
  settings,
  isSaved = false,
  onSave,
  onPrimaryAction,
  onMediaClick,
}: Readonly<PropertyCardProps>): ReactElement {
  const resolvedSettings = resolvePropertyCardSettings(settings);
  const tagBrands = readPropertyTagBrands(listing);
  const { tagCarouselRef, shouldScroll } = usePropertyTagCarouselOverflow(tagBrands);

  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-[1.75rem] border-white/10 bg-white/8 p-0 text-white shadow-[0_18px_72px_rgba(4,11,24,0.18)] backdrop-blur-xl',
        resolvedSettings.highlight ? 'ring-1 ring-amber-300/25' : '',
        resolvedSettings.className,
      )}
    >
      <div className="relative overflow-hidden">
        <PropertyCarousel
          listing={listing}
          onMediaClick={onMediaClick}
          showIndicators={resolvedSettings.showCarouselIndicators}
          showNavigation={resolvedSettings.showCarouselNavigation}
        />
        <PropertyCardHeader
          isSaved={isSaved}
          listing={listing}
          onSave={onSave}
          settings={resolvedSettings}
        />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <PropertyCardBody listing={listing} />

        {resolvedSettings.showTags && tagBrands.length > 0 ? (
          <PropertyCardTags
            shouldScroll={shouldScroll}
            tagBrands={tagBrands}
            tagCarouselRef={tagCarouselRef}
          />
        ) : null}

        <PropertyCardStatsSection listing={listing} settings={resolvedSettings} />

        {resolvedSettings.showPrimaryAction && listing.primaryActionLabel ? (
          <Button
            type="button"
            className="w-full rounded-full bg-white text-slate-950 hover:bg-slate-100"
            onClick={() => onPrimaryAction?.(listing)}
          >
            {listing.primaryActionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
