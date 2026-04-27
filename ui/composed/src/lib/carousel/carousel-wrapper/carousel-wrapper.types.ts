import type { CarouselApi, CarouselOptions } from '@org/ui-primitives';
import type { ReactNode } from 'react';

export type CarouselWrapperClasses = Readonly<{
  wrapper: string;
  content: string;
  item: string;
  next: string;
  prev: string;
  navigation: string;
  viewport: string;
}>;

export type CarouselWrapperProps = Readonly<{
  children: ReactNode;
  autoplayDelay?: number;
  autoplay?: boolean;
  playOnHover?: boolean;
  dragFree?: boolean;
  stopOnInteraction?: boolean;
  pauseOnHover?: boolean;
  showNavigation?: boolean;
  classes?: Partial<CarouselWrapperClasses>;
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical';
  opts?: CarouselOptions;
  setApi?: (api: CarouselApi | undefined) => void;
}>;
