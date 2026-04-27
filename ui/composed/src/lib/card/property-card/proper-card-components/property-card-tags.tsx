import type { ReactElement } from 'react';
import type { BrandBadgeItem } from '../../../badge';
import { BrandCarousel } from '../../../carousel';

export function PropertyCardTags({
  shouldScroll,
  tagBrands,
  tagCarouselRef,
}: Readonly<{
  shouldScroll: boolean;
  tagBrands: readonly BrandBadgeItem[];
  tagCarouselRef: React.RefObject<HTMLDivElement | null>;
}>): ReactElement | null {
  if (tagBrands.length === 0) {
    return null;
  }

  return (
    <div ref={tagCarouselRef} className="max-w-full">
      <BrandCarousel
        autoplay={false}
        badgeVariant="outline"
        brands={tagBrands}
        classes={{
          content: '!ml-0 md:!ml-0',
          next: 'right-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80',
          prev: 'left-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80',
          wrapper: 'w-full',
        }}
        itemClassName="pl-0 md:pl-0"
        loop={false}
        playOnHover={shouldScroll}
        showNavigation={false}
        stopOnInteraction={false}
      />
    </div>
  );
}
