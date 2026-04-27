import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { BrandBadge } from './brand-badge';

const sampleBrand = {
  id: 'atelier-ripple',
  name: 'Atelier Ripple',
  description: 'Editorial interiors and staging partner.',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=256&q=80',
} as const;

const meta: Meta<typeof BrandBadge> = {
  component: BrandBadge,
  title: 'Composed/Badge/BrandBadge',
  args: {
    brand: sampleBrand,
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

export const WithIconAndLink: Story = {
  args: {
    brand: {
      ...sampleBrand,
      href: '/partners/atelier-ripple',
      icon: 'sparkles',
    },
  },
};

export const Interactive: Story = {
  args: {
    clickable: true,
  },
};
