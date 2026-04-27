import { Badge } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';

export function ProductCarouselBadges({
  activeMediaType,
  item,
}: Readonly<{
  activeMediaType?: FeedStreamItem['mediaItems'][number]['type'];
  item: FeedStreamItem;
}>): ReactElement {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
      <Badge className="rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-xl">
        {item.surfaceLabel}
      </Badge>
      <Badge className="rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-xl">
        {item.primaryReason}
      </Badge>
      <Badge className="rounded-full bg-slate-950/55 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
        {item.statusLabel}
      </Badge>
      {activeMediaType === 'video' ? (
        <Badge className="rounded-full bg-emerald-500/18 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
          Video
        </Badge>
      ) : null}
    </div>
  );
}
