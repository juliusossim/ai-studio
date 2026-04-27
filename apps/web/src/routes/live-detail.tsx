import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function LiveDetailRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/', label: 'Back to discovery' }]}
      description="Live session detail is reserved as a public route with richer signed-in participation to support attendance, chat, and live commerce calls to action."
      eyebrow="Live"
      title="Live session route"
    />
  );
}
