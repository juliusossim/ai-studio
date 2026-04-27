import type { AuthenticatedRequest } from '../auth/auth.types';

export interface RequestContextStore {
  requestId: string;
  method: string;
  path: string;
  startedAt: number;
  userId?: string;
}

export interface ObservedRequest extends AuthenticatedRequest {
  header(name: string): string | undefined;
  ip: string;
  ips: string[];
  method: string;
  originalUrl: string;
  requestId?: string;
  url: string;
}
