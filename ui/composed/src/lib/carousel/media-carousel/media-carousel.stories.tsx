import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { MediaCarousel } from './media-carousel';

const imageItems = [
  {
    id: 'loft-lounge',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'Loft lounge with natural light',
  },
  {
    id: 'kitchen-detail',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kitchen detail with marble island',
  },
  {
    id: 'bedroom-suite',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bedroom suite',
  },
] as const;

const mixedItems = [
  ...imageItems.slice(0, 2),
  {
    id: 'flower-video',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    mimeType: 'video/mp4',
    poster:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    alt: 'Flower video',
  },
] as const;

const meta: Meta<typeof MediaCarousel> = {
  component: MediaCarousel,
  title: 'Composed/Carousel/MediaCarousel',
  args: {
    items: imageItems,
    name: 'Listing gallery',
    showIndicators: true,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-3xl rounded-[1.75rem] bg-slate-950 p-6 text-white">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ImageGallery: Story = {};

export const MixedMedia: Story = {
  args: {
    items: mixedItems,
    showControls: true,
    autoPlayVideo: false,
  },
};

export const AutoPlayGallery: Story = {
  args: {
    autoplay: true,
    autoplayDelay: 2400,
    loop: true,
    pauseOnHover: true,
  },
};
