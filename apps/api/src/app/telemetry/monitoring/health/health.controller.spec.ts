import { HealthController } from './health.controller';
import { ApplicationLifecycleService } from '../../lifecycle/application-lifecycle.service';

describe('HealthController', () => {
  let lifecycle: ApplicationLifecycleService;
  let controller: HealthController;

  beforeEach(() => {
    lifecycle = new ApplicationLifecycleService();
    controller = new HealthController(lifecycle);
  });

  it('reports readiness only when the application is running', () => {
    const response = createResponseRecorder();
    const body = controller.getReadiness(response);

    expect(response.statusCode).toBe(503);
    expect(body.ready).toBe(false);

    lifecycle.markReady();
    const readyResponse = createResponseRecorder();
    const readyBody = controller.getReadiness(readyResponse);

    expect(readyResponse.statusCode).toBe(200);
    expect(readyBody.ready).toBe(true);
  });

  it('keeps liveness green during graceful shutdown but fails after fatal state', () => {
    lifecycle.markReady();
    lifecycle.beginShutdown('signal:SIGTERM');

    const shuttingDownResponse = createResponseRecorder();
    const shuttingDownBody = controller.getLiveness(shuttingDownResponse);

    expect(shuttingDownResponse.statusCode).toBe(200);
    expect(shuttingDownBody.live).toBe(true);

    lifecycle.markFatal('uncaught_exception');
    const fatalResponse = createResponseRecorder();
    const fatalBody = controller.getLiveness(fatalResponse);

    expect(fatalResponse.statusCode).toBe(503);
    expect(fatalBody.live).toBe(false);
  });
});

interface ResponseRecorder {
  readonly statusCode?: number;
  status(code: number): void;
}

function createResponseRecorder(): ResponseRecorder {
  return {
    status(code: number): void {
      (this as { statusCode?: number }).statusCode = code;
    },
  };
}
