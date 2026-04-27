import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FormInput } from './form-input';
import { FormStoryShell, StoryPanel } from '../form-story-helpers';

const meta: Meta<typeof FormInput> = {
  component: FormInput,
  title: 'Composed/Form/FormInput',
  args: {
    name: 'title',
    label: 'Listing title',
    description: 'Use a short editorial title that reads well in feed cards.',
    placeholder: 'Oceanfront villa with private pier',
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ title: '' }}>
      <FormInput {...args} />
    </FormStoryShell>
  ),
};

export const WithValue: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ title: 'Palm Heights penthouse' }}>
      <FormInput {...args} />
    </FormStoryShell>
  ),
};
