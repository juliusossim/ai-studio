import type { CarouselWrapperClasses } from '../carousel-wrapper';
import type { BadgeVariant } from '@org/ui-primitives';
import type { BrandBadgeItem } from '../../badge';

export type BrandCarouselProps = Readonly<{
  brands: readonly BrandBadgeItem[];
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  showNavigation?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  stopOnInteraction?: boolean;
  pauseOnHover?: boolean;
  playOnHover?: boolean;
  loop?: boolean;
  classes?: Partial<CarouselWrapperClasses>;
  badgeVariant?: BadgeVariant;
  onBrandClick?: (brand: BrandBadgeItem) => void;
}>;
