import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardListingsRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[
        { href: '/dashboard/listings/new', label: 'New listing' },
        { href: '/dashboard/listings/import', label: 'Import listings' },
      ]}
      description="Listings workspace is the durable inventory route for property and listing lifecycle management."
      eyebrow="Dashboard"
      title="Listings workspace"
    />
  );
}
