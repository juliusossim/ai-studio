import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { MediaRenderer } from '@org/ui-primitives';

const meta: Meta<typeof MediaRenderer> = {
  component: MediaRenderer,
  title: 'Composed/Media/MediaRenderer',
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">{Story()}</div>
    ),
  ],
  args: {
    alt: 'Modern interior',
    className: 'h-72 w-full overflow-hidden rounded-xl bg-slate-950',
    mediaClassName: 'h-full w-full object-cover',
    source: {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Image: Story = {};

export const ContainedImage: Story = {
  args: {
    objectFit: 'contain',
    className: 'h-72 w-full overflow-hidden rounded-xl bg-slate-950 p-4',
  },
};

export const Video: Story = {
  args: {
    source: {
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      mimeType: 'video/mp4',
    },
    alt: 'Flower video',
    poster:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    showControls: true,
  },
};
