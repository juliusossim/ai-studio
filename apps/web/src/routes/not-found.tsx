import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function NotFoundRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/', label: 'Go to discovery' }]}
      description="This route catches unmatched URLs while the new route tree is still being filled in."
      eyebrow="404"
      title="Page not found"
    />
  );
}
