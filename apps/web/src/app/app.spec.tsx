import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { SignInPage } from '@org/ui-web';
import { AppProviders } from './app';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <AppProviders>
        <SignInPage onCreateAccount={() => undefined} />
      </AppProviders>,
    );
    await waitFor(() => expect(screen.getAllByText('Sign in').length).toBeGreaterThan(0));

    expect(baseElement).toBeTruthy();
  });

  it('should render the sign-in page after session restore fails', async () => {
    render(
      <AppProviders>
        <SignInPage onCreateAccount={() => undefined} />
      </AppProviders>,
    );

    await waitFor(() => expect(screen.getAllByText('Sign in').length).toBeGreaterThan(0));
  });
});
