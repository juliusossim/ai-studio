import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardContentRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard', label: 'Back to dashboard' }]}
      description="Content workspace is reserved for creator posts, campaigns, and social distribution workflows."
      eyebrow="Dashboard"
      title="Content workspace"
    />
  );
}
