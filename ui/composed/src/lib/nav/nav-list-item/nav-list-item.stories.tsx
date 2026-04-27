import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { Building2 } from 'lucide-react';
import { NavigationMenu, NavigationMenuList } from '@org/ui-primitives';
import { NavListItem } from './nav-list-item';

const meta: Meta<typeof NavListItem> = {
  component: NavListItem,
  title: 'Composed/Nav/NavListItem',
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <NavigationMenu
        className="max-w-sm rounded-[1.5rem] border border-border/60 bg-card p-4 shadow-sm"
        viewport={false}
      >
        <NavigationMenuList className="block space-y-3">{Story()}</NavigationMenuList>
      </NavigationMenu>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/collections/editorial-homes',
    icon: <Building2 className="h-4 w-4" />,
    title: 'Editorial homes',
    children: 'Curated residential stories with stronger visual hierarchy and richer metadata.',
  },
};

export const CustomLinkRenderer: Story = {
  args: {
    href: '/collections/editorial-homes',
    icon: <Building2 className="h-4 w-4" />,
    title: 'Editorial homes',
    children: 'Rendered through a custom link adapter instead of a raw anchor tag.',
    renderLink: ({ href, children, className }) => (
      <a className={className} data-kind="custom-link" href={href}>
        {children}
      </a>
    ),
  },
};
