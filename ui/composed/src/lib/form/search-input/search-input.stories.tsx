import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { SearchInput } from './search-input';
import { FormStoryShell, StoryPanel } from '../form-story-helpers';

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  title: 'Composed/Form/SearchInput',
  args: {
    name: 'query',
    label: 'Search inventory',
    description: 'Search by neighborhood, agent, amenity, or collection name.',
    placeholder: 'Try “beachfront” or “concierge”',
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ query: '' }}>
      <SearchInput {...args} />
    </FormStoryShell>
  ),
};

export const WithValue: Story = {
  render: (args) => (
    <FormStoryShell defaultValues={{ query: 'waterfront penthouse' }}>
      <SearchInput {...args} />
    </FormStoryShell>
  ),
};
