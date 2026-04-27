import type { ReactElement } from 'react';
import { RoutePlaceholder } from './route-placeholder';

export default function SettingsRoute(): ReactElement {
  return (
    <RoutePlaceholder
      actions={[{ href: '/feed', label: 'Return to feed' }]}
      description="Settings is reserved for account, profile, and preference management in the authenticated workspace."
      eyebrow="Settings"
      title="Settings route"
    />
  );
}
