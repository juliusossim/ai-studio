import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { PropertyCarousel } from './property-carousel';

const sampleListing = {
  id: 'marina-residence',
  title: 'Marina Residence',
  media: [
    {
      id: 'marina-living',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      alt: 'Living room with bay-facing windows',
    },
    {
      id: 'marina-dining',
      url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
      alt: 'Dining area with warm lighting',
    },
    {
      id: 'marina-video',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      mimeType: 'video/mp4',
      poster:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
      alt: 'Short video walkthrough preview',
    },
  ],
} as const;

const imageOnlyListing = {
  id: 'terrace-loft',
  title: 'Terrace Loft',
  image:
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
} as const;

const meta: Meta<typeof PropertyCarousel> = {
  component: PropertyCarousel,
  title: 'Composed/Carousel/PropertyCarousel',
  args: {
    listing: sampleListing,
    showIndicators: true,
    showNavigation: true,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-lg rounded-[1.75rem] bg-slate-950 p-6 text-white">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MixedMedia: Story = {
  args: {
    showControls: true,
  },
};

export const ImageFallback: Story = {
  args: {
    listing: imageOnlyListing,
    showIndicators: false,
  },
};

export const AutoPlayGallery: Story = {
  args: {
    autoplay: true,
    autoplayDelay: 2400,
    loop: true,
    pauseOnHover: true,
    autoPlayVideo: false,
  },
};
