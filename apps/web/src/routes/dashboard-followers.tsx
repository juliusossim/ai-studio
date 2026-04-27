import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function DashboardFollowersRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/dashboard', label: 'Back to dashboard' }]}
      description="Follower insights and creator-audience monitoring belong here once creator identity and return loops are fully implemented."
      eyebrow="Dashboard"
      title="Followers route"
    />
  );
}
