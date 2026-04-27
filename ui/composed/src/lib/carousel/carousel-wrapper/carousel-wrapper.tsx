import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  cn,
  type CarouselApi,
} from '@org/ui-primitives';
import { useEffect, useState, type ReactElement } from 'react';
import type { CarouselWrapperProps } from './carousel-wrapper.types';

type ResolvedCarouselApi = Exclude<CarouselApi, undefined>;

function hasCarouselApi(api: CarouselApi | null): api is ResolvedCarouselApi {
  return api !== null && api !== undefined;
}

export function CarouselWrapper({
  children,
  autoplayDelay = 3000,
  autoplay = true,
  playOnHover = false,
  dragFree = true,
  stopOnInteraction = false,
  pauseOnHover = true,
  showNavigation = true,
  classes,
  loop = true,
  orientation = 'horizontal',
  opts,
  setApi,
}: Readonly<CarouselWrapperProps>): ReactElement | null {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasStoppedOnInteraction, setHasStoppedOnInteraction] = useState(false);

  const shouldUseAutoplay = autoplay || playOnHover;
  const shouldAutoAdvance =
    hasCarouselApi(carouselApi) &&
    !hasStoppedOnInteraction &&
    ((autoplay && (!pauseOnHover || !isHovered)) || (!autoplay && playOnHover && isHovered));

  useEffect(() => {
    if (!hasCarouselApi(carouselApi) || !shouldAutoAdvance) {
      return;
    }

    const resolvedCarouselApi = carouselApi;
    const intervalId = globalThis.setInterval(() => {
      if (resolvedCarouselApi.canScrollNext()) {
        resolvedCarouselApi.scrollNext();
        return;
      }

      if (loop) {
        resolvedCarouselApi.scrollTo(0);
      }
    }, autoplayDelay);

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [autoplayDelay, carouselApi, loop, shouldAutoAdvance]);

  useEffect(() => {
    if (!hasCarouselApi(carouselApi) || !stopOnInteraction) {
      return;
    }

    const resolvedCarouselApi = carouselApi;
    const handlePointerDown = (): void => {
      setHasStoppedOnInteraction(true);
    };

    resolvedCarouselApi.on('pointerDown', handlePointerDown);

    return () => {
      resolvedCarouselApi.off('pointerDown', handlePointerDown);
    };
  }, [carouselApi, stopOnInteraction]);

  const handleApiChange = (nextApi: CarouselApi | undefined): void => {
    setCarouselApi(nextApi ?? null);
    setApi?.(nextApi);
    setHasStoppedOnInteraction(false);
  };

  if (!children) {
    return null;
  }

  return (
    <Carousel
      className={cn(
        'group w-full',
        classes?.wrapper,
        orientation === 'vertical'
          ? '**:data-[slot=carousel-content]:h-full [&_[data-slot=carousel-content]>div]:h-full'
          : undefined,
      )}
      onMouseEnter={shouldUseAutoplay ? () => setIsHovered(true) : undefined}
      onMouseLeave={shouldUseAutoplay ? () => setIsHovered(false) : undefined}
      orientation={orientation}
      opts={{
        align: 'start',
        dragFree,
        loop,
        ...opts,
      }}
      setApi={handleApiChange}
    >
      <CarouselContent className={cn('-ml-2 items-center md:-ml-4', classes?.content)}>
        {children}
      </CarouselContent>

      {showNavigation ? (
        <>
          <CarouselPrevious
            className={cn(
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100',
              classes?.prev,
            )}
          />
          <CarouselNext
            className={cn(
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100',
              classes?.next,
            )}
          />
        </>
      ) : null}
    </Carousel>
  );
}
