import { Button, CarouselItem, MediaRenderer, cn, type CarouselApi } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { CarouselWrapper } from '../carousel-wrapper';
import type { MediaCarouselItem, MediaCarouselProps } from './media-carousel.types';

type ResolvedCarouselApi = Exclude<CarouselApi, undefined>;

function hasCarouselApi(api: CarouselApi | null): api is ResolvedCarouselApi {
  return api !== null && api !== undefined;
}

function getMediaItemKey(item: MediaCarouselItem, index: number): string {
  return item.id ?? `${item.url}-${index}`;
}

export function MediaCarousel({
  items,
  name,
  className,
  contentClassName,
  slideClassName = 'h-64 sm:h-72',
  mediaClassName = 'h-full w-full object-cover',
  buttonClassName = 'h-full w-full p-0',
  showNavigation = true,
  autoplay = false,
  autoplayDelay = 3000,
  loop = false,
  pauseOnHover = true,
  playOnHover = false,
  stopOnInteraction = false,
  showIndicators = false,
  showControls = false,
  autoPlayVideo = false,
  classes,
  carouselOpts,
  onApiChange,
  onItemClick,
}: Readonly<MediaCarouselProps>): ReactElement | null {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldShowNavigation = showNavigation && items.length > 1;
  const shouldShowIndicators = showIndicators && items.length > 1;

  useEffect(() => {
    onApiChange?.(carouselApi ?? undefined);
  }, [carouselApi, onApiChange]);

  useEffect(() => {
    if (!hasCarouselApi(carouselApi)) {
      setActiveIndex(0);
      return;
    }

    const resolvedCarouselApi = carouselApi;
    const updateActiveIndex = (): void => {
      setActiveIndex(resolvedCarouselApi.selectedScrollSnap());
    };

    updateActiveIndex();
    resolvedCarouselApi.on('select', updateActiveIndex);
    resolvedCarouselApi.on('reInit', updateActiveIndex);

    return () => {
      resolvedCarouselApi.off('select', updateActiveIndex);
      resolvedCarouselApi.off('reInit', updateActiveIndex);
    };
  }, [carouselApi]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      <CarouselWrapper
        autoplay={autoplay}
        autoplayDelay={autoplayDelay}
        classes={{
          ...classes,
          content: cn('!ml-0', contentClassName, classes?.content),
          next: cn(
            'right-2 border-white/16 bg-slate-950/55 text-white hover:bg-slate-950/70 hover:text-white',
            classes?.next,
          ),
          prev: cn(
            'left-2 border-white/16 bg-slate-950/55 text-white hover:bg-slate-950/70 hover:text-white',
            classes?.prev,
          ),
        }}
        loop={loop}
        opts={carouselOpts}
        pauseOnHover={pauseOnHover}
        playOnHover={playOnHover}
        setApi={setCarouselApi}
        showNavigation={shouldShowNavigation}
        stopOnInteraction={stopOnInteraction}
      >
        {items.map((item, index) => {
          const slideLabel = `Open slide ${index + 1} of ${name}`;
          const media = (
            <MediaRenderer
              source={{ url: item.url, mimeType: item.mimeType }}
              alt={item.alt ?? name}
              className="h-full w-full"
              mediaClassName={mediaClassName}
              poster={item.poster}
              showControls={showControls}
              autoPlay={autoPlayVideo}
              loop={autoPlayVideo}
            />
          );

          return (
            <CarouselItem
              key={getMediaItemKey(item, index)}
              aria-label={slideLabel}
              className={cn('pl-0', slideClassName)}
            >
              {onItemClick ? (
                <Button
                  type="button"
                  aria-label={slideLabel}
                  className={buttonClassName}
                  onClick={() => onItemClick({ item, index })}
                  variant="ghost"
                >
                  {media}
                </Button>
              ) : (
                <div className="h-full w-full">{media}</div>
              )}
            </CarouselItem>
          );
        })}
      </CarouselWrapper>

      {shouldShowIndicators ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {items.map((item, index) => (
            <button
              key={`${getMediaItemKey(item, index)}-indicator`}
              type="button"
              aria-label={`Show slide ${index + 1} for ${name}`}
              className={cn(
                'h-2.5 w-2.5 rounded-full border border-white/30 transition-colors',
                index === activeIndex ? 'bg-white' : 'bg-white/30',
              )}
              onClick={() => carouselApi?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
