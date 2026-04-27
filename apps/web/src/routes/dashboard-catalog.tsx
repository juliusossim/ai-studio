import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardCatalogRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[
        { href: '/dashboard/catalog/new', label: 'New product' },
        { href: '/dashboard/catalog/import', label: 'Import catalog' },
      ]}
      description="Catalog workspace is the dedicated route for commerce inventory such as materials, furniture, and other product-catalog entries."
      eyebrow="Dashboard"
      title="Catalog workspace"
    />
  );
}
