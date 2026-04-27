import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { ProductCarousel } from './product-carousel';

const sampleProduct = {
  id: 'vacation-edit',
  name: 'Vacation Edit',
  imageUrls: [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  ],
} as const;

const mediaDrivenProduct = {
  id: 'studio-edit',
  name: 'Studio Edit',
  media: [
    {
      id: 'studio-model-1',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Editorial portrait in neutral tailoring',
    },
    {
      id: 'studio-model-2',
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Close-up of layered styling',
    },
  ],
} as const;

const meta: Meta<typeof ProductCarousel> = {
  component: ProductCarousel,
  title: 'Composed/Carousel/ProductCarousel',
  args: {
    product: sampleProduct,
    showNavigation: true,
    showIndicators: true,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-md rounded-[1.5rem] bg-slate-950 p-6 text-white">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AutoPlay: Story = {
  args: {
    autoplay: true,
    autoplayDelay: 2200,
    loop: true,
    pauseOnHover: true,
  },
};

export const MediaItems: Story = {
  args: {
    product: mediaDrivenProduct,
    showIndicators: false,
  },
};
