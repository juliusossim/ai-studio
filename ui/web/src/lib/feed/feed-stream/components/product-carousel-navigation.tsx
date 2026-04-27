import { Button, cn } from '@org/ui-primitives';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';
import {
  readNextMediaIndex,
  readPreviousMediaIndex,
  stopProductCarouselEventPropagation,
} from '../product-carousel.utils';

export function ProductCarouselNavigation({
  activeMediaIndex,
  item,
  onSelectMedia,
}: Readonly<{
  activeMediaIndex: number;
  item: FeedStreamItem;
  onSelectMedia: (index: number) => void;
}>): ReactElement | null {
  if (item.mediaItems.length <= 1) {
    return null;
  }

  return (
    <>
      <Button
        aria-label={`Show previous image for ${item.title}`}
        className="absolute left-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
        onClick={(event) => {
          stopProductCarouselEventPropagation(event);
          onSelectMedia(readPreviousMediaIndex(activeMediaIndex, item.mediaItems.length));
        }}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        aria-label={`Show next image for ${item.title}`}
        className="absolute right-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
        onClick={(event) => {
          stopProductCarouselEventPropagation(event);
          onSelectMedia(readNextMediaIndex(activeMediaIndex, item.mediaItems.length));
        }}
        size="sm"
        variant="outline"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {item.mediaItems.map((media, index) => (
          <button
            aria-label={`Show media ${index + 1} for ${item.title}`}
            className={cn(
              'h-2.5 w-2.5 rounded-full border border-white/30 transition-colors',
              index === activeMediaIndex ? 'bg-white' : 'bg-white/30',
            )}
            key={`${media.type}-${media.url}-${media.alt || item.id}`}
            onClick={(event) => {
              stopProductCarouselEventPropagation(event);
              onSelectMedia(index);
            }}
            type="button"
          />
        ))}
      </div>
    </>
  );
}
