import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FormSelect } from './form-select';
import {
  FormStoryShell,
  StoryPanel,
  basicSelectOptions,
  groupedSelectOptions,
} from '../form-story-helpers';

const meta: Meta<typeof FormSelect> = {
  component: FormSelect,
  title: 'Composed/Form/FormSelect',
  args: {
    name: 'city',
    label: 'Market',
    description: 'Choose the primary market where this listing should appear first.',
    options: basicSelectOptions,
    placeholder: 'Select a city',
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ city: '' }}>
      <FormSelect {...args} />
    </FormStoryShell>
  ),
};

export const Grouped: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ city: '' }}>
      <FormSelect
        {...args}
        label="Property type"
        name="propertyType"
        options={groupedSelectOptions}
      />
    </FormStoryShell>
  ),
};
