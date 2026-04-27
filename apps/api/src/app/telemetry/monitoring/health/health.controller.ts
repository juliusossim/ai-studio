import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApplicationLifecycleService } from '../../lifecycle/application-lifecycle.service';

export interface HealthResponse {
  live: boolean;
  ready: boolean;
  reason?: string;
  service: 'ripples-api';
  state: 'fatal' | 'running' | 'shutting_down' | 'starting';
  timestamp: string;
}

interface HealthResponseWriter {
  status(code: number): void;
}

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly lifecycle: ApplicationLifecycleService) {}

  @Get()
  getHealth(@Res({ passthrough: true }) response: HealthResponseWriter): HealthResponse {
    return this.writeHealthResponse(response, 'ready');
  }

  @Get('live')
  getLiveness(@Res({ passthrough: true }) response: HealthResponseWriter): HealthResponse {
    return this.writeHealthResponse(response, 'live');
  }

  @Get('ready')
  getReadiness(@Res({ passthrough: true }) response: HealthResponseWriter): HealthResponse {
    return this.writeHealthResponse(response, 'ready');
  }

  private writeHealthResponse(
    response: HealthResponseWriter,
    mode: 'live' | 'ready',
  ): HealthResponse {
    const snapshot = this.lifecycle.snapshot();
    const healthy = mode === 'ready' ? snapshot.ready : snapshot.live;
    response.status(healthy ? 200 : 503);

    return {
      live: snapshot.live,
      ready: snapshot.ready,
      ...(snapshot.reason ? { reason: snapshot.reason } : {}),
      service: 'ripples-api',
      state: snapshot.state,
      timestamp: new Date().toISOString(),
    };
  }
}
