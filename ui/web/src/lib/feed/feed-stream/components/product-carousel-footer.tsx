import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';

export function ProductCarouselFooter({
  activeMediaType,
  item,
}: Readonly<{
  activeMediaType?: FeedStreamItem['mediaItems'][number]['type'];
  item: FeedStreamItem;
}>): ReactElement {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-5">
      <div className="space-y-3">
        {item.priceLabel || item.locationLabel ? (
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs text-white/82 backdrop-blur-xl">
            {item.priceLabel ? (
              <span className="font-semibold text-amber-200">{item.priceLabel}</span>
            ) : null}
            {item.locationLabel ? <span>{item.locationLabel}</span> : null}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {item.reasonBadges.map((badge) => (
            <span
              className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/74 backdrop-blur-xl"
              key={badge}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div
        className={cn(
          'rounded-full border border-white/14 bg-slate-950/55 px-3 py-2 text-xs text-white/80 backdrop-blur-xl',
          activeMediaType === 'video' ? 'block' : 'hidden sm:block',
        )}
      >
        Double tap to like
      </div>
    </div>
  );
}
