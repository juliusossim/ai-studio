import type { CarouselApi, CarouselOptions, MediaSource } from '@org/ui-primitives';
import type { CarouselWrapperClasses } from '../carousel-wrapper';

export type MediaCarouselItem = Readonly<
  MediaSource & {
    id?: string;
    alt?: string;
    poster?: string;
  }
>;

export type MediaCarouselClickArgs = Readonly<{
  item: MediaCarouselItem;
  index: number;
}>;

export type MediaCarouselProps = Readonly<{
  items: readonly MediaCarouselItem[];
  name: string;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
  mediaClassName?: string;
  buttonClassName?: string;
  showNavigation?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  playOnHover?: boolean;
  stopOnInteraction?: boolean;
  showIndicators?: boolean;
  showControls?: boolean;
  autoPlayVideo?: boolean;
  classes?: Partial<CarouselWrapperClasses>;
  carouselOpts?: CarouselOptions;
  onApiChange?: (api: CarouselApi | undefined) => void;
  onItemClick?: (args: MediaCarouselClickArgs) => void;
}>;
