import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { LoadingSpinner } from './loading-spinner';

const meta: Meta<typeof LoadingSpinner> = {
  component: LoadingSpinner,
  title: 'Composed/Feedback/LoadingSpinner',
  args: {
    title: 'Preparing the next view',
    message: 'Fetching the newest listing cards and editorial metadata.',
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

export const WithPreviewImage: Story = {
  args: {
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  },
};

export const ShortMessage: Story = {
  args: {
    title: 'Loading saved views',
    message: 'Almost there.',
  },
};
