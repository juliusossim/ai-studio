import type { ReactElement } from 'react';
import { MediaCarousel } from '../media-carousel';
import type {
  PropertyCarouselItem,
  PropertyCarouselProps,
  PropertyMediaItem,
} from './property-carousel.types';

function normalizeListingMedia(listing: PropertyCarouselItem): PropertyMediaItem[] {
  if (listing.media && listing.media.length > 0) {
    return [...listing.media];
  }

  if (listing.image) {
    return [
      {
        id: `${listing.id}-image`,
        url: listing.image,
        alt: listing.title,
      },
    ];
  }

  return [];
}

export function PropertyCarousel({
  listing,
  onMediaClick,
  className,
  contentClassName,
  slideClassName = 'h-64 sm:h-72',
  mediaClassName = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
  buttonClassName,
  showNavigation = true,
  showIndicators = false,
  autoplay = false,
  autoplayDelay = 3000,
  loop = false,
  pauseOnHover = true,
  playOnHover = false,
  stopOnInteraction = false,
  showControls = false,
  autoPlayVideo = false,
}: Readonly<PropertyCarouselProps>): ReactElement | null {
  const items = normalizeListingMedia(listing);

  return (
    <MediaCarousel
      items={items}
      name={listing.title}
      className={className}
      contentClassName={contentClassName}
      slideClassName={slideClassName}
      mediaClassName={mediaClassName}
      buttonClassName={buttonClassName}
      showNavigation={showNavigation}
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      loop={loop}
      pauseOnHover={pauseOnHover}
      playOnHover={playOnHover}
      stopOnInteraction={stopOnInteraction}
      showIndicators={showIndicators}
      showControls={showControls}
      autoPlayVideo={autoPlayVideo}
      onItemClick={onMediaClick}
    />
  );
}
