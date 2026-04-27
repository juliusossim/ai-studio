import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function InboxRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/feed', label: 'Back to feed' }]}
      description="Inbox is the stable handoff point for inquiry, viewing, and live follow-up conversations."
      eyebrow="Messaging"
      title="Inbox route"
    />
  );
}
