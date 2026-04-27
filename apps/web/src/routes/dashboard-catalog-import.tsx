import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardCatalogImportRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard/catalog/new', label: 'Create one product' }]}
      description="Bulk product and catalog entry belongs here, including future spreadsheet-driven imports and supplier inventory ingestion."
      eyebrow="Catalog"
      title="Catalog import route"
    />
  );
}
