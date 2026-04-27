import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { ProductGrid } from './product-grid';

const sampleProducts = [
  {
    id: 'linen-edit-01',
    name: 'Linen Resort Set',
    description: 'Lightweight coordinated set for warm-weather travel and editorial layering.',
    price: {
      price: 248,
      currency: 'USD',
      locale: 'en-US',
      originalPrice: 320,
      discount: 22,
    },
    rating: 4.8,
    soldLabel: '8.4k+',
    imageUrls: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
    brands: [
      { id: 'atelier-ripple', name: 'Atelier Ripple', description: 'Editorial capsule partner' },
    ],
  },
  {
    id: 'shoreline-satin-02',
    name: 'Shoreline Satin Dress',
    description: 'Fluid silhouette with a polished drape and understated resort elegance.',
    price: {
      price: 312,
      currency: 'USD',
      locale: 'en-US',
    },
    rating: 4.6,
    soldLabel: '5.9k+',
    imageUrls: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    brands: [
      { id: 'shoreline-house', name: 'Shoreline House', description: 'Resort styling studio' },
    ],
  },
] as const;

const meta: Meta<typeof ProductGrid> = {
  component: ProductGrid,
  title: 'Composed/Grid/ProductGrid',
  args: {
    products: sampleProducts,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    products: [],
    emptyText: 'No curated products available right now.',
  },
};
