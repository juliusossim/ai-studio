import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FashionCard } from './fashion-card';

const sampleProduct = {
  id: 'linen-edit-01',
  name: 'Linen Resort Set',
  description:
    'A lightweight coordinated set designed for warm-weather travel, editorial layering, and elevated day-to-evening styling.',
  price: {
    price: 248,
    currency: 'USD',
    locale: 'en-US',
    originalPrice: 320,
    discount: 22,
  },
  rating: 4.8,
  soldLabel: '8.4k+',
  detailHref: '/products/linen-resort-set',
  imageUrls: [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  ],
  brands: [
    {
      id: 'atelier-ripple',
      name: 'Atelier Ripple',
      description: 'Editorial capsule partner',
    },
    {
      id: 'shoreline-house',
      name: 'Shoreline House',
      description: 'Resort styling studio',
    },
  ],
  interactionCounts: {
    likes: 1480,
    saves: 310,
    comments: 42,
    shares: 88,
    reglams: 14,
  },
  interactionState: {
    liked: true,
    saved: false,
    shared: false,
    reglammed: false,
  },
} as const;

const meta: Meta<typeof FashionCard> = {
  component: FashionCard,
  title: 'Composed/Card/FashionCard',
  args: {
    product: sampleProduct,
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-md bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">
        {Story()}
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MerchandisingFocused: Story = {
  args: {
    settings: {
      descriptionLineClamp: 2,
      showSocialInteractions: false,
      showRating: false,
      showBrandCarousel: true,
      showViewAction: true,
      viewActionContent: 'Preview',
      actionContent: 'Add to board',
    },
  },
};

export const MinimalContent: Story = {
  args: {
    settings: {
      descriptionLineClamp: 2,
      showBrandCarousel: false,
      showSocialInteractions: false,
      showSoldText: false,
      showDescription: false,
      showActions: false,
      showViewAction: false,
    },
  },
};
