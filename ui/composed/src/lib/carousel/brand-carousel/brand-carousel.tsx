import { CarouselItem, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { BrandBadge } from '../../badge';
import { CarouselWrapper } from '../carousel-wrapper';
import type { BrandCarouselProps } from './brand-carousel.types';

export function BrandCarousel({
  brands,
  className,
  contentClassName,
  itemClassName,
  showNavigation = true,
  autoplay = true,
  autoplayDelay = 3000,
  stopOnInteraction = false,
  pauseOnHover = true,
  playOnHover = false,
  loop = true,
  classes,
  badgeVariant = 'outline',
  onBrandClick,
}: Readonly<BrandCarouselProps>): ReactElement | null {
  if (brands.length === 0) {
    return null;
  }

  return (
    <CarouselWrapper
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      classes={{
        ...classes,
        content: cn(contentClassName, classes?.content),
        prev: cn(
          'left-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80 hover:text-white',
          classes?.prev,
        ),
        next: cn(
          'right-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80 hover:text-white',
          classes?.next,
        ),
        wrapper: cn(className, classes?.wrapper),
      }}
      loop={loop}
      pauseOnHover={pauseOnHover}
      playOnHover={playOnHover}
      showNavigation={showNavigation}
      stopOnInteraction={stopOnInteraction}
    >
      {brands.map((brand) => (
        <CarouselItem key={brand.id} className={cn('basis-auto pl-2 md:pl-4', itemClassName)}>
          <BrandBadge
            brand={brand}
            clickable={Boolean(onBrandClick)}
            onClick={onBrandClick}
            variant={badgeVariant}
          />
        </CarouselItem>
      ))}
    </CarouselWrapper>
  );
}
