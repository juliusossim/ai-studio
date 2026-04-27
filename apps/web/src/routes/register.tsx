import type { ReactElement } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { RegistrationPage, useSession } from '@org/ui-web';
import type { Route } from './+types/register';
import { buildSignInPath, parseRouteRedirectSearch } from './route-contracts';

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{
  redirectTo: string;
}> {
  return parseRouteRedirectSearch(request.url);
}

export default function RegisterRoute({ loaderData }: Route.ComponentProps): ReactElement {
  const navigate = useNavigate();
  const session = useSession();
  const { redirectTo } = loaderData;

  if (session.status === 'authenticated') {
    return <Navigate replace to={redirectTo} />;
  }

  return (
    <RegistrationPage
      onSignIn={() => {
        void navigate(buildSignInPath({ redirectTo }));
      }}
    />
  );
}
