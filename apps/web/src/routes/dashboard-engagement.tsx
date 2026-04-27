import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardEngagementRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard', label: 'Back to dashboard' }]}
      description="Engagement summaries will live here once creator attribution, notifications, and conversion loops are wired into the dashboard."
      eyebrow="Dashboard"
      title="Engagement route"
    />
  );
}
