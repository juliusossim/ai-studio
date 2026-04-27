import type { Meta, StoryObj } from '@storybook/react-vite';
import { Amount } from './amount';

const meta: Meta<typeof Amount> = {
  component: Amount,
  title: 'Composed/Amount/Amount',
  args: {
    price: 185000,
    currency: 'USD',
    locale: 'en-US',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOriginalPrice: Story = {
  args: {
    price: 185000,
    currency: 'USD',
    locale: 'en-US',
    originalPrice: 225000,
  },
};

export const WithDiscount: Story = {
  args: {
    price: 185000,
    currency: 'USD',
    locale: 'en-US',
    discount: 18,
  },
};

export const WithIncrement: Story = {
  args: {
    price: 185000,
    currency: 'USD',
    locale: 'en-US',
    increment: 12.5,
  },
};
