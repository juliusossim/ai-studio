import type { Meta, StoryObj } from '@storybook/react-vite';
import { StarRating } from './star-rating';

const meta: Meta<typeof StarRating> = {
  component: StarRating,
  title: 'Composed/Stars/StarRating',
  args: {
    rating: 4.2,
    showValue: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    rating: 3.7,
    size: 14,
  },
};

export const PerfectScore: Story = {
  args: {
    rating: 5,
  },
};

export const TenPointScale: Story = {
  args: {
    rating: 8.6,
    maxRating: 10,
    size: 16,
  },
};
