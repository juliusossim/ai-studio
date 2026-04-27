import { useState, type ReactElement } from 'react';
import { Button } from '@org/ui-primitives';
import { useOptionalRipplesApi } from '@org/data';
import { apiUnavailableMessage } from '../google/auth-page-utils';
import { useSession } from '../../session/provider/session-provider';

type HealthStatus = 'idle' | 'checking' | 'healthy' | 'unhealthy';
const defaultApiBaseUrl = 'http://localhost:3000/api';

function createHealthUrl(apiBaseUrl: string): string {
  const normalized = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  return `${normalized}/health`;
}

async function requestHealth(url: string): Promise<boolean> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  return response.ok;
}

export function AuthApiRecovery(): ReactElement | null {
  const api = useOptionalRipplesApi();
  const { error, refreshSession, status } = useSession();
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [isRetrying, setIsRetrying] = useState(false);
  const apiBaseUrl = api?.apiBaseUrl ?? defaultApiBaseUrl;

  if (error !== apiUnavailableMessage) {
    return null;
  }

  async function retryConnection(): Promise<void> {
    setIsRetrying(true);
    setHealthStatus('idle');
    try {
      await refreshSession();
    } finally {
      setIsRetrying(false);
    }
  }

  async function checkApiHealth(): Promise<void> {
    setHealthStatus('checking');

    try {
      const isHealthy = await requestHealth(createHealthUrl(apiBaseUrl));
      setHealthStatus(isHealthy ? 'healthy' : 'unhealthy');
    } catch {
      setHealthStatus('unhealthy');
    }
  }

  let healthMessage: string | undefined;
  if (healthStatus === 'healthy') {
    healthMessage = 'API is reachable again. Retry the connection to restore your session.';
  } else if (healthStatus === 'unhealthy') {
    healthMessage =
      'API health check failed. Confirm the backend is running on the configured port.';
  }

  return (
    <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-foreground">Backend unavailable</p>
      <p className="mt-1 leading-6 text-muted-foreground">{apiUnavailableMessage}</p>
      {healthMessage ? (
        <p className="mt-2 leading-6 text-muted-foreground">{healthMessage}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          disabled={isRetrying || status === 'loading'}
          onClick={() => {
            void retryConnection();
          }}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isRetrying ? 'Retrying...' : 'Retry connection'}
        </Button>
        <Button
          disabled={healthStatus === 'checking'}
          onClick={() => {
            void checkApiHealth();
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          {healthStatus === 'checking' ? 'Checking API...' : 'Check API health'}
        </Button>
      </div>
    </div>
  );
}
