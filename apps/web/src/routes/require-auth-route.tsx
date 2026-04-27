import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ProtectedRoute } from '@org/ui-web';
import { buildSignInPath, composeRedirectTo } from './route-contracts';

export function RequireAuthRoute({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const location = useLocation();
  const redirectTo = composeRedirectTo(location.pathname, location.search);

  return (
    <ProtectedRoute fallback={<Navigate replace to={buildSignInPath({ redirectTo })} />}>
      {children}
    </ProtectedRoute>
  );
}
