import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function CreatorProfileRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/', label: 'Back to discovery' }]}
      description="Creator profile is reserved as a public surface for attribution, follow state, promoted inventory, and creator-led distribution."
      eyebrow="Creators"
      title="Creator profile route"
    />
  );
}
