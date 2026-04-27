import type { ReactElement } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { SignInPage, useSession } from '@org/ui-web';
import type { Route } from './+types/sign-in';
import { buildRegisterPath, parseRouteRedirectSearch } from './route-contracts';

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{
  redirectTo: string;
}> {
  return parseRouteRedirectSearch(request.url);
}

export default function SignInRoute({ loaderData }: Route.ComponentProps): ReactElement {
  const navigate = useNavigate();
  const session = useSession();
  const { redirectTo } = loaderData;

  if (session.status === 'authenticated') {
    return <Navigate replace to={redirectTo} />;
  }

  return (
    <SignInPage
      onCreateAccount={() => {
        void navigate(buildRegisterPath({ redirectTo }));
      }}
    />
  );
}
