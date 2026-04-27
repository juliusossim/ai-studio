import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FormSearchableSelect } from './searchable-select';
import {
  FormStoryShell,
  StoryPanel,
  basicSelectOptions,
  groupedSelectOptions,
  multiSelectOptions,
} from '../form-story-helpers';

const meta: Meta<typeof FormSearchableSelect> = {
  component: FormSearchableSelect,
  title: 'Composed/Form/FormSearchableSelect',
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <FormStoryShell defaultValues={{ market: '' }}>
      <FormSearchableSelect
        description="Searchable single-select for large option sets."
        emptyText="No market found."
        label="Market"
        name="market"
        options={basicSelectOptions}
        placeholder="Find a market"
        showClear
      />
    </FormStoryShell>
  ),
};

export const Grouped: Story = {
  render: () => (
    <FormStoryShell defaultValues={{ category: '' }}>
      <FormSearchableSelect
        description="Grouped options help when the list spans multiple domains."
        emptyText="No category found."
        grouped
        label="Category"
        name="category"
        options={groupedSelectOptions}
        placeholder="Choose a category"
        popup
      />
    </FormStoryShell>
  ),
};

export const Multiple: Story = {
  render: () => (
    <FormStoryShell defaultValues={{ amenities: ['concierge', 'private-gym'] }}>
      <FormSearchableSelect
        description="Multi-select keeps selected values visible as chips."
        emptyText="No amenity found."
        label="Amenities"
        multiple
        name="amenities"
        options={multiSelectOptions}
        placeholder="Select amenities"
      />
    </FormStoryShell>
  ),
};
