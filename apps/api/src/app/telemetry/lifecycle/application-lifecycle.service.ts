import { Injectable } from '@nestjs/common';

export type ApplicationLifecycleState = 'fatal' | 'running' | 'shutting_down' | 'starting';

export interface ApplicationLifecycleSnapshot {
  readonly live: boolean;
  readonly ready: boolean;
  readonly reason?: string;
  readonly state: ApplicationLifecycleState;
  readonly updatedAt: string;
}

@Injectable()
export class ApplicationLifecycleService {
  private reason?: string;
  private state: ApplicationLifecycleState = 'starting';
  private updatedAt = new Date();

  markReady(): void {
    if (this.state === 'fatal') {
      return;
    }

    this.state = 'running';
    this.reason = undefined;
    this.updatedAt = new Date();
  }

  beginShutdown(reason: string): boolean {
    if (this.state === 'fatal') {
      return false;
    }

    if (this.state === 'shutting_down') {
      return false;
    }

    this.state = 'shutting_down';
    this.reason = reason;
    this.updatedAt = new Date();

    return true;
  }

  markFatal(reason: string): boolean {
    const changed = this.state !== 'fatal' || this.reason !== reason;
    this.state = 'fatal';
    this.reason = reason;
    this.updatedAt = new Date();

    return changed;
  }

  snapshot(): ApplicationLifecycleSnapshot {
    const live = this.state !== 'fatal';
    const ready = this.state === 'running';

    return {
      live,
      ready,
      ...(this.reason ? { reason: this.reason } : {}),
      state: this.state,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
