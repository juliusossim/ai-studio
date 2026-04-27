import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { PropertyCard } from './property-card';

const sampleListing = {
  id: 'listing-palm-heights',
  title: 'Palm Heights Penthouse',
  image:
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
  media: [
    {
      id: 'palm-heights-lounge',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      alt: 'Lounge area with panoramic windows',
    },
    {
      id: 'palm-heights-kitchen',
      url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
      alt: 'Kitchen with stone island',
    },
    {
      id: 'palm-heights-bedroom',
      url: 'https://images.unsplash.com/photo-1505693538694-cf8d7aa6f4e1?auto=format&fit=crop&w=1400&q=80',
      alt: 'Bedroom suite with terrace access',
    },
  ],
  amount: {
    price: 1250000,
    currency: 'USD',
    locale: 'en-US',
  },
  locationLabel: 'Cantonments, Accra',
  description:
    'An elevated penthouse with wraparound views, layered indoor-outdoor living, and a refined hospitality-inspired finish palette.',
  statusLabel: 'New',
  badges: ['Featured', 'Verified'],
  tagBrands: [
    {
      id: 'roof-deck',
      name: 'Roof deck',
    },
    {
      id: 'concierge',
      name: 'Concierge',
    },
    {
      id: 'smart-home',
      name: 'Smart home',
    },
    {
      id: 'private-gym',
      name: 'Private gym',
    },
  ],
  propertyStats: {
    beds: 4,
    baths: 5,
    area: '480 sqm',
  },
  primaryActionLabel: 'Schedule viewing',
} as const;

const meta: Meta<typeof PropertyCard> = {
  component: PropertyCard,
  title: 'Composed/Card/PropertyCard',
  args: {
    listing: sampleListing,
    settings: {
      highlight: true,
      showTags: true,
      showCarouselIndicators: true,
    },
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-md bg-[radial-gradient(circle_at_top,#1f3558_0%,#0b1320_48%,#070b12_100%)] p-6">
        {Story()}
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SavedState: Story = {
  args: {
    isSaved: true,
  },
};

export const CompactStats: Story = {
  args: {
    listing: {
      ...sampleListing,
      propertyStats: undefined,
      stats: [
        { label: 'Yield', value: '6.4%' },
        { label: 'Occupancy', value: '91%' },
        { label: 'Parking', value: '2 bays' },
      ],
    },
    settings: {
      highlight: false,
      showTags: false,
      showCarouselIndicators: false,
    },
  },
};
