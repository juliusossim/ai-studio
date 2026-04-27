import { Injectable } from '@nestjs/common';
import { ErrorReporterService } from './error-reporter.service';

@Injectable()
export class NoopErrorReporterService extends ErrorReporterService {
  captureException(): void {
    // Intentionally empty until a production reporter is configured.
  }

  shutdown(): void {
    // Intentionally empty until a production reporter is configured.
  }
}
