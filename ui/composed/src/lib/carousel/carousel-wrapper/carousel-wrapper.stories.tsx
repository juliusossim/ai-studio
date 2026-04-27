import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { CarouselItem } from '@org/ui-primitives';
import { CarouselWrapper } from './carousel-wrapper';

const slides = [
  {
    id: 'editorial-1',
    title: 'Editorial spotlight',
    accent: 'from-amber-300/80 via-orange-200/70 to-rose-200/60',
  },
  {
    id: 'editorial-2',
    title: 'Collection focus',
    accent: 'from-sky-300/80 via-cyan-200/70 to-blue-100/60',
  },
  {
    id: 'editorial-3',
    title: 'New arrivals',
    accent: 'from-emerald-300/80 via-lime-200/70 to-yellow-100/60',
  },
] as const;

const meta: Meta<typeof CarouselWrapper> = {
  component: CarouselWrapper,
  title: 'Composed/Carousel/CarouselWrapper',
  args: {
    children: null,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-2xl rounded-[1.75rem] bg-slate-950 p-6 text-white">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

function SlideShell(): ReactElement {
  return (
    <>
      {slides.map((slide) => (
        <CarouselItem className="pl-0" key={slide.id}>
          <div
            className={`flex h-72 items-end rounded-[1.5rem] bg-gradient-to-br ${slide.accent} p-6 text-slate-950 shadow-lg`}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                Composed carousel
              </p>
              <p className="text-2xl font-semibold">{slide.title}</p>
            </div>
          </div>
        </CarouselItem>
      ))}
    </>
  );
}

export const Default: Story = {
  args: {},
  render: () => (
    <CarouselWrapper showNavigation>
      <SlideShell />
    </CarouselWrapper>
  ),
};

export const AutoPlay: Story = {
  args: {},
  render: () => (
    <CarouselWrapper autoplay autoplayDelay={2200} loop pauseOnHover showNavigation>
      <SlideShell />
    </CarouselWrapper>
  ),
};

export const WithoutNavigation: Story = {
  args: {},
  render: () => (
    <CarouselWrapper showNavigation={false}>
      <SlideShell />
    </CarouselWrapper>
  ),
};
