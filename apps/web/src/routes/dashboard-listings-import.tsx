import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardListingsImportRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard/listings/new', label: 'Create one listing' }]}
      description="Listings import is reserved for bulk property intake, repeat listing entry, CSV import, and draft review before publish."
      eyebrow="Dashboard"
      title="Listings import route"
    />
  );
}
