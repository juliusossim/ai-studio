import { useEffect, useRef, useState } from 'react';
import type { PropertyCardProps } from './property-card.types';

export function usePropertyTagCarouselOverflow(
  tagBrands: PropertyCardProps['listing']['tagBrands'],
): Readonly<{ tagCarouselRef: React.RefObject<HTMLDivElement | null>; shouldScroll: boolean }> {
  const tagCarouselRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = tagCarouselRef.current;

    if (!container || !tagBrands || tagBrands.length === 0) {
      setShouldScroll(false);
      return;
    }

    const measureOverflow = (): void => {
      const viewport = container.querySelector<HTMLElement>('[data-slot="carousel-content"]');
      const content = viewport?.firstElementChild as HTMLElement | null;

      if (!viewport || !content) {
        setShouldScroll(false);
        return;
      }

      setShouldScroll(content.scrollWidth > viewport.clientWidth + 1);
    };

    measureOverflow();

    const resizeObserver = new ResizeObserver(() => {
      measureOverflow();
    });

    resizeObserver.observe(container);

    const viewport = container.querySelector<HTMLElement>('[data-slot="carousel-content"]');
    const content = viewport?.firstElementChild as HTMLElement | null;

    if (viewport) {
      resizeObserver.observe(viewport);
    }

    if (content) {
      resizeObserver.observe(content);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [tagBrands]);

  return {
    tagCarouselRef,
    shouldScroll,
  };
}
