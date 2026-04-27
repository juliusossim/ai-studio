import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardCatalogNewRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard/catalog', label: 'Back to catalog' }]}
      description="Single product creation belongs here rather than inside content or listing routes. The next implementation step is to define the catalog product schema and creation form."
      eyebrow="Catalog"
      title="New catalog product route"
    />
  );
}
