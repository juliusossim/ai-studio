import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';
import { RequireAuthRoute } from './require-auth-route';

export default function ListingRequestViewingRoute(): ReactElement {
  return (
    <RequireAuthRoute>
      <RoutePlaceholder
        actions={[{ href: '/inbox', label: 'Open inbox' }]}
        description="This route reserves the viewing-request flow so scheduling intent has a stable URL boundary instead of being trapped inside feed or detail-only local state."
        eyebrow="Conversion"
        title="Request viewing route"
      />
    </RequireAuthRoute>
  );
}
