import type { ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AppHydrateFallback, AppProviders } from './app/app';
import './styles.css';

export function Layout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>Ripples</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback(): ReactNode {
  return <AppHydrateFallback />;
}

export default function Root(): ReactNode {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}
