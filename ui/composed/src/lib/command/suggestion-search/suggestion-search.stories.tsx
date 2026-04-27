import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@org/ui-primitives';
import { Building2, MapPin, Sparkles } from 'lucide-react';
import { SuggestionSearch } from './suggestion-search';

function SuggestionSearchStory(): ReactElement {
  const [open, setOpen] = useState(true);

  return (
    <div className="max-w-xl bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] p-6">
      <SuggestionSearch
        description="Jump into inventory, collections, or editorial actions."
        groups={[
          {
            id: 'listings',
            title: 'Listings',
            items: [
              {
                id: 'palm-heights',
                title: 'Palm Heights penthouse',
                description: 'Featured residential listing in Cantonments.',
                icon: <Building2 className="h-4 w-4" />,
                keywords: ['listing', 'penthouse', 'accra'],
              },
              {
                id: 'marina-view',
                title: 'Marina view duplex',
                description: 'Waterfront editorial listing with terrace suite.',
                icon: <MapPin className="h-4 w-4" />,
                keywords: ['duplex', 'waterfront', 'marina'],
              },
            ],
          },
          {
            id: 'actions',
            title: 'Actions',
            items: [
              {
                id: 'create-collection',
                title: 'Create collection',
                description: 'Start a new editorial collection.',
                icon: <Sparkles className="h-4 w-4" />,
                keywords: ['new', 'collection', 'editorial'],
              },
            ],
          },
        ]}
        onOpenChange={setOpen}
        open={open}
        placeholder="Search Ripples"
        title="Suggestion search"
        trigger={
          <Button onClick={() => setOpen(true)} type="button" variant="outline">
            Open suggestion search
          </Button>
        }
      />
    </div>
  );
}

const meta: Meta<typeof SuggestionSearch> = {
  component: SuggestionSearch,
  title: 'Composed/Command/SuggestionSearch',
  args: {
    open: false,
    onOpenChange: () => undefined,
    groups: [],
    placeholder: 'Search Ripples',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => <SuggestionSearchStory />,
};
