import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[
        { href: '/dashboard/listings', label: 'Listings workspace' },
        { href: '/dashboard/catalog', label: 'Catalog workspace' },
      ]}
      description="Dashboard is now a concrete authenticated route boundary for creator and operator workspace experiences."
      eyebrow="Dashboard"
      title="Dashboard route"
    />
  );
}
