import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { SocialInteractions } from './social-interactions';

const meta: Meta<typeof SocialInteractions> = {
  component: SocialInteractions,
  title: 'Composed/Social/SocialInteractions',
  args: {
    counts: {
      likes: 1280,
      saves: 364,
      comments: 48,
      shares: 96,
      reglams: 18,
    },
    state: {
      liked: true,
      saved: false,
      shared: false,
      reglammed: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {};

export const Overlay: Story = {
  args: {
    variant: 'overlay',
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#08172b_0%,#0c213d_100%)] p-6">
        {Story()}
      </div>
    ),
  ],
};

export const ReglamEnabled: Story = {
  args: {
    variant: 'overlay',
    reglamMeta: {
      enabled: true,
      commissionRate: 12,
      shareCount: 24,
    },
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#08172b_0%,#0c213d_100%)] p-6">
        {Story()}
      </div>
    ),
  ],
};
