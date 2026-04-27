import { useCallback, useEffect, useState } from 'react';
import {
  clearGoogleCallbackFromLocation,
  createGoogleRedirectUri,
  readClientError,
  readGoogleCallback,
} from './auth-page-utils';
import { useSession } from '../../session/provider/session-provider';
import type { GoogleAuthFlowOptions, GoogleAuthFlowState } from './google-auth.types';

export function useGoogleAuthFlow({
  callbackMessage,
  successMessage,
}: Readonly<GoogleAuthFlowOptions>): GoogleAuthFlowState {
  const { completeGoogleOAuth, startGoogleOAuth } = useSession();
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const callback = readGoogleCallback();
    if (!callback) {
      return;
    }

    setIsGoogleConnecting(true);
    setMessage(callbackMessage);
    completeGoogleOAuth(callback)
      .then((response) => {
        setMessage(successMessage(response.user.fullName));
        clearGoogleCallbackFromLocation();
      })
      .catch((error: unknown) => setMessage(readClientError(error)))
      .finally(() => setIsGoogleConnecting(false));
  }, [callbackMessage, completeGoogleOAuth, successMessage]);

  const startGoogleAuth = useCallback(async (): Promise<void> => {
    setIsGoogleConnecting(true);
    setMessage(null);
    try {
      const response = await startGoogleOAuth({
        redirectUri: createGoogleRedirectUri(),
      });
      window.location.assign(response.authorizationUrl);
    } catch (error) {
      setIsGoogleConnecting(false);
      setMessage(readClientError(error));
    }
  }, [startGoogleOAuth]);

  return {
    isGoogleConnecting,
    message: message ?? undefined,
    setMessage: (nextMessage) => {
      setMessage(nextMessage ?? null);
    },
    startGoogleAuth,
  };
}
