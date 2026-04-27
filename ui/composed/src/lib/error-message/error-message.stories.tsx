import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { ErrorMessage } from './error-message';

const meta: Meta<typeof ErrorMessage> = {
  component: ErrorMessage,
  title: 'Composed/Feedback/ErrorMessage',
  args: {
    message: 'We could not load this collection right now.',
  },
  argTypes: {
    onRetry: { action: 'retry' },
    onGoBack: { action: 'goBack' },
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="bg-[linear-gradient(180deg,#fff7fb_0%,#f7f4ff_100%)] p-6">{Story()}</div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIllustration: Story = {
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Abstract warning illustration',
  },
};

export const Recoverable: Story = {
  args: {
    message: 'Publishing failed because the network connection dropped mid-request.',
    onRetry: () => undefined,
    onGoBack: () => undefined,
  },
};
