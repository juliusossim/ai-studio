import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button, CommandGroup, CommandItem } from '@org/ui-primitives';
import { CommandWrapper } from './command-wrapper';

function CommandWrapperStory(): ReactElement {
  const [open, setOpen] = useState(true);

  return (
    <div className="max-w-xl bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">
      <CommandWrapper
        description="Browse actions, destinations, and saved views."
        emptyText="No matching commands."
        open={open}
        openChange={setOpen}
        placeholder="Search commands"
        title="Workspace search"
        trigger={
          <Button onClick={() => setOpen(true)} type="button" variant="outline">
            Open command palette
          </Button>
        }
      >
        <CommandGroup heading="Navigation">
          <CommandItem value="dashboard">Dashboard</CommandItem>
          <CommandItem value="saved-views">Saved views</CommandItem>
          <CommandItem value="collections">Collections</CommandItem>
        </CommandGroup>
      </CommandWrapper>
    </div>
  );
}

const meta: Meta<typeof CommandWrapper> = {
  component: CommandWrapper,
  title: 'Composed/Command/CommandWrapper',
  args: {
    open: false,
    openChange: () => undefined,
    placeholder: 'Search commands',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => <CommandWrapperStory />,
};
