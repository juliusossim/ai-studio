import { useEffect, useRef, useState, type ReactElement } from 'react';
import { FeedMedia } from './feed-media';
import type { FeedStreamItem } from '../feed-utils/feed.utils';
import { clearProductCarouselBurstTimeout } from './product-carousel.utils';
import {
  ProductCarouselBadges,
  ProductCarouselFooter,
  ProductCarouselLikeBurst,
  ProductCarouselLikeButton,
  ProductCarouselNavigation,
} from './components';

export interface ProductCarouselProps {
  readonly item: FeedStreamItem;
  readonly isLiked: boolean;
  readonly onDoubleLike: () => void;
  readonly onToggleLike: () => void;
}

export function ProductCarousel({
  item,
  isLiked,
  onDoubleLike,
  onToggleLike,
}: Readonly<ProductCarouselProps>): ReactElement {
  const lastTapRef = useRef(0);
  const burstTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const activeMedia = item.mediaItems[activeMediaIndex] ?? item.mediaItems[0];

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [item.id]);

  useEffect(() => {
    return () => {
      clearProductCarouselBurstTimeout(burstTimeoutRef);
    };
  }, []);

  function triggerLikeBurst(): void {
    onDoubleLike();
    setShowBurst(true);

    clearProductCarouselBurstTimeout(burstTimeoutRef);

    burstTimeoutRef.current = globalThis.setTimeout(() => {
      setShowBurst(false);
    }, 650);
  }

  function handleTouchEnd(): void {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      triggerLikeBurst();
    }

    lastTapRef.current = now;
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950">
      <FeedMedia
        media={activeMedia}
        mediaKey={`${item.id}-${activeMediaIndex}`}
        title={item.title}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,24,0.15)_0%,rgba(3,10,24,0)_38%,rgba(3,10,24,0.84)_100%)]" />

      <button
        aria-label={`Like ${item.title} by double tap or double click`}
        className="absolute inset-0 z-0 cursor-pointer bg-transparent"
        onDoubleClick={triggerLikeBurst}
        onTouchEnd={handleTouchEnd}
        type="button"
      />
      <ProductCarouselBadges activeMediaType={activeMedia?.type} item={item} />
      <ProductCarouselLikeButton
        isLiked={isLiked}
        itemTitle={item.title}
        onToggleLike={onToggleLike}
      />
      <ProductCarouselNavigation
        activeMediaIndex={activeMediaIndex}
        item={item}
        onSelectMedia={setActiveMediaIndex}
      />
      <ProductCarouselLikeBurst showBurst={showBurst} />
      <ProductCarouselFooter activeMediaType={activeMedia?.type} item={item} />
    </div>
  );
}
