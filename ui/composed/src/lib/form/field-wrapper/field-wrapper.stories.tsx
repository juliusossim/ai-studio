import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { FieldWrapper } from './field-wrapper';
import { FieldWrapperShowcase, FormStoryShell, StoryPanel } from '../form-story-helpers';

const meta: Meta<typeof FieldWrapper> = {
  component: FieldWrapper,
  title: 'Composed/Form/FieldWrapper',
  args: {
    name: 'passcode',
    children: () => null,
  },
  decorators: [(Story: () => ReactElement): ReactElement => <StoryPanel>{Story()}</StoryPanel>],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <FormStoryShell defaultValues={{ passcode: '' }}>
      <FieldWrapperShowcase />
    </FormStoryShell>
  ),
};
