import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function InboxThreadRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/inbox', label: 'Back to inbox' }]}
      description="Thread detail is reserved as the durable conversation route for inquiry and conversion follow-up."
      eyebrow="Messaging"
      title="Inbox thread route"
    />
  );
}
