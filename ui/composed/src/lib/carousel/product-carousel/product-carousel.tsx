import type { ReactElement } from 'react';
import { MediaCarousel } from '../media-carousel';
import type { ProductCarouselProduct, ProductCarouselProps } from './product-carousel.types';

function normalizeProductMedia(product: ProductCarouselProduct) {
  if (product.media && product.media.length > 0) {
    return [...product.media];
  }

  return (product.imageUrls ?? []).map((url, index) => ({
    id: `${product.id}-image-${index + 1}`,
    url,
    alt: product.name,
  }));
}

export function ProductCarousel({
  product,
  onImageClick,
  children,
  className,
  contentClassName,
  slideClassName,
  mediaClassName,
  showNavigation = true,
  showIndicators = false,
  autoplay = false,
  autoplayDelay = 3000,
  loop = false,
  pauseOnHover = true,
  playOnHover = false,
  stopOnInteraction = false,
}: Readonly<ProductCarouselProps>): ReactElement | null {
  const items = normalizeProductMedia(product);

  if (children) {
    return children;
  }

  return (
    <MediaCarousel
      className={className}
      contentClassName={contentClassName}
      items={items}
      mediaClassName={mediaClassName}
      name={product.name}
      onItemClick={
        onImageClick
          ? ({ item, index }) =>
              onImageClick({
                index,
                url: item.url,
              })
          : undefined
      }
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      loop={loop}
      pauseOnHover={pauseOnHover}
      playOnHover={playOnHover}
      stopOnInteraction={stopOnInteraction}
      showIndicators={showIndicators}
      showNavigation={showNavigation}
      slideClassName={slideClassName}
    />
  );
}
