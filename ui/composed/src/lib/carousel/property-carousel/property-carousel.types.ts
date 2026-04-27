import type { MediaCarouselItem } from '../media-carousel';

export type PropertyMediaItem = MediaCarouselItem;

export type PropertyCarouselItem = Readonly<{
  id: string;
  title: string;
  image?: string;
  media?: readonly PropertyMediaItem[];
}>;

export type PropertyCarouselClickArgs = Readonly<{
  item: PropertyMediaItem;
  index: number;
}>;

export type PropertyCarouselProps = Readonly<{
  listing: PropertyCarouselItem;
  onMediaClick?: (args: PropertyCarouselClickArgs) => void;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
  mediaClassName?: string;
  buttonClassName?: string;
  showNavigation?: boolean;
  showIndicators?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  playOnHover?: boolean;
  stopOnInteraction?: boolean;
  showControls?: boolean;
  autoPlayVideo?: boolean;
}>;
