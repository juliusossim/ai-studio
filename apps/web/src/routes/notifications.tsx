import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function NotificationsRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/feed', label: 'Return to feed' }]}
      description="Notifications is now a dedicated route boundary for return loops, replies, follows, live events, and offer changes."
      eyebrow="Return loops"
      title="Notifications route"
    />
  );
}
