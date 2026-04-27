import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { Building2, Compass, LayoutGrid } from 'lucide-react';
import { NavListItem } from '../nav-list-item';
import { NavMenu } from './nav-menu';

const meta: Meta<typeof NavMenu> = {
  component: NavMenu,
  title: 'Composed/Nav/NavMenu',
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-sm">
        {Story()}
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleItems = [
  {
    id: 'discover',
    name: 'Discover',
    icon: <Compass className="h-4 w-4" />,
    href: '/discover',
    active: true,
  },
  {
    id: 'collections',
    name: 'Collections',
    icon: <LayoutGrid className="h-4 w-4" />,
    children: (
      <div className="grid gap-3 p-4 md:w-[420px] md:grid-cols-2">
        <NavListItem
          href="/collections/editorial"
          icon={<Building2 className="h-4 w-4" />}
          title="Editorial homes"
        >
          High-intent residential collections with stronger visual storytelling.
        </NavListItem>
        <NavListItem
          href="/collections/short-stay"
          icon={<Compass className="h-4 w-4" />}
          title="Short-stay stays"
        >
          Flexible inventory curated for mobility, hospitality, and premium travel use.
        </NavListItem>
      </div>
    ),
  },
] as const;

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const WithCustomLinks: Story = {
  args: {
    items: sampleItems,
    renderLink: ({ href, children, className }) => (
      <a className={className} data-nav-link="custom" href={href}>
        {children}
      </a>
    ),
  },
};
