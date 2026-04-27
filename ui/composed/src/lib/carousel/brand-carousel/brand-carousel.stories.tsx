import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { BrandCarousel } from './brand-carousel';

const sampleBrands = [
  {
    id: 'atelier-ripple',
    name: 'Atelier Ripple',
    description: 'Contemporary interiors and apartment staging.',
  },
  {
    id: 'harbor-stone',
    name: 'Harbor Stone',
    description: 'Waterfront development and design partner.',
  },
  {
    id: 'luma-living',
    name: 'Luma Living',
    description: 'Short-stay furnishing and lighting package.',
  },
  {
    id: 'civic-lofts',
    name: 'Civic Lofts',
    description: 'Urban loft branding studio.',
  },
] as const;

const meta: Meta<typeof BrandCarousel> = {
  component: BrandCarousel,
  title: 'Composed/Carousel/BrandCarousel',
  args: {
    brands: sampleBrands,
    showNavigation: true,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-2xl rounded-[1.5rem] bg-slate-950 p-6 text-white">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AutoPlay: Story = {
  args: {
    autoplay: true,
    pauseOnHover: true,
    loop: true,
  },
};

export const WithoutNavigation: Story = {
  args: {
    showNavigation: false,
  },
};
