import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';
import { RequireAuthRoute } from './require-auth-route';

export default function ListingInquireRoute(): ReactElement {
  return (
    <RequireAuthRoute>
      <RoutePlaceholder
        actions={[{ href: '/inbox', label: 'Open inbox' }]}
        description="This route reserves the inquiry flow boundary. It should become the durable start of buyer inquiry creation before handing off into inbox threads."
        eyebrow="Conversion"
        title="Inquiry route"
      />
    </RequireAuthRoute>
  );
}
