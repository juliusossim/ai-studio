import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FormCheckbox } from './form-checkbox';
import { FormStoryShell, StoryPanel } from '../form-story-helpers';

const meta: Meta<typeof FormCheckbox> = {
  component: FormCheckbox,
  title: 'Composed/Form/FormCheckbox',
  args: {
    name: 'featured',
    label: 'Feature this listing',
    description: 'Featured inventory appears in premium feed positions and homepage modules.',
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ featured: false }}>
      <FormCheckbox {...args} />
    </FormStoryShell>
  ),
};

export const Checked: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ featured: true }}>
      <FormCheckbox {...args} />
    </FormStoryShell>
  ),
};
