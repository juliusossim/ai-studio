import './app.css';
import { AuthProvider, WebErrorBoundary, WebThemeProvider } from '@org/ui-web';
import { RipplesApiProvider } from '@org/data';
import type { ReactElement, ReactNode } from 'react';

export interface AppProvidersProps {
  readonly children: ReactNode;
}

export function AppProviders({ children }: Readonly<AppProvidersProps>): ReactElement {
  const apiBaseUrl = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/api';

  return (
    <WebErrorBoundary>
      <WebThemeProvider>
        <RipplesApiProvider apiBaseUrl={apiBaseUrl}>
          <AuthProvider apiBaseUrl={apiBaseUrl}>{children}</AuthProvider>
        </RipplesApiProvider>
      </WebThemeProvider>
    </WebErrorBoundary>
  );
}

export function AppHydrateFallback(): ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Ripples</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">Loading workspace</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Preparing the feed, session, and route state.
        </p>
      </section>
    </main>
  );
}

export default AppProviders;
