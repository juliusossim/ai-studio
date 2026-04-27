import type { Meta, StoryObj } from '@storybook/react-vite';
import { TruncatedText } from './typography';

const meta: Meta<typeof TruncatedText> = {
  component: TruncatedText,
  title: 'Composed/Typography/TruncatedText',
  args: {
    text: 'A broad, sunlit duplex with two terraces, layered living spaces, and a calm residential outlook near transit.',
    maxWidth: 260,
    color: 'muted',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleLine: Story = {};

export const MultiLineClamp: Story = {
  args: {
    lineClamp: 3,
    truncate: false,
    maxWidth: 320,
    text: 'A broad, sunlit duplex with two terraces, layered living spaces, and a calm residential outlook near transit. The home balances entertaining space with quieter corners for focused work and slower evenings.',
  },
};

export const WithoutTooltip: Story = {
  args: {
    showTooltip: false,
  },
};
