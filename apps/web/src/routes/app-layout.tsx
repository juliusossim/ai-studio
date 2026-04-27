import type { ReactElement } from 'react';
import { NavLink, Outlet } from 'react-router';
import { AuthenticatedLayout } from '@org/ui-web';
import { RequireAuthRoute } from './require-auth-route';

const navigationItems = [
  { label: 'Feed', to: '/feed' },
  { label: 'Saved', to: '/saved' },
  { label: 'Inbox', to: '/inbox' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Settings', to: '/settings' },
] as const;

export default function AppLayout(): ReactElement {
  return (
    <RequireAuthRoute>
      <AuthenticatedLayout title="Ripples workspace">
        <nav className="mb-8 flex flex-wrap gap-2 rounded-[1.25rem] border bg-card p-2 shadow-sm">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted',
                ].join(' ')
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </AuthenticatedLayout>
    </RequireAuthRoute>
  );
}
