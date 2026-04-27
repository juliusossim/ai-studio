import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function SavedRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/feed', label: 'Return to feed' }]}
      description="Saved is now a dedicated authenticated route so return loops can become URL-driven instead of implicit store state."
      eyebrow="Saved"
      title="Saved route"
    />
  );
}
