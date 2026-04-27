import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreInfoText } from './more-info-text';

const meta: Meta<typeof MoreInfoText> = {
  component: MoreInfoText,
  title: 'Composed/Typography/MoreInfoText',
  args: {
    title: (
      <button
        className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
        type="button"
      >
        Neighborhood insights
      </button>
    ),
    content: (
      <div className="space-y-2">
        <p className="text-sm font-medium">What locals love</p>
        <p className="text-sm text-muted-foreground">
          Walkable cafes, quieter side streets, and a short commute to the business district.
        </p>
      </div>
    ),
    className: 'w-72',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomPanel: Story = {
  args: {
    children: (
      <div className="space-y-3">
        <p className="text-sm font-semibold">Area snapshot</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          <li>12-minute walk to the station</li>
          <li>Excellent weekend market nearby</li>
          <li>Strong family-friendly school coverage</li>
        </ul>
      </div>
    ),
  },
};

export const ControlledOpen: Story = {
  args: {
    open: true,
  },
};
