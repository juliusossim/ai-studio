import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FormTextarea } from './form-textarea';
import { FormStoryShell, StoryPanel } from '../form-story-helpers';

const meta: Meta<typeof FormTextarea> = {
  component: FormTextarea,
  title: 'Composed/Form/FormTextarea',
  args: {
    name: 'description',
    label: 'Listing description',
    description: 'Aim for a calm, editorial tone that highlights atmosphere and differentiators.',
    placeholder: 'Describe the home, its setting, and what makes the experience memorable.',
    rows: 5,
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ description: '' }}>
      <FormTextarea {...args} />
    </FormStoryShell>
  ),
};

export const WithContent: Story = {
  render: (args) => (
    <FormStoryShell
      defaultValues={{
        description:
          'A warm-toned residence with layered indoor-outdoor living, generous natural light, and a short walk to the neighborhood’s best cafes and waterfront path.',
      }}
    >
      <FormTextarea {...args} />
    </FormStoryShell>
  ),
};
