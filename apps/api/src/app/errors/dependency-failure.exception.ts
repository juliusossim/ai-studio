import { HttpStatus } from '@nestjs/common';
import { problemTypes } from '../telemetry/http/problem-details/problem-type.constants';
import { AppException } from './app-exception';

export class DependencyFailureException extends AppException {
  constructor(detail = 'A required dependency is temporarily unavailable.') {
    super({
      detail,
      logLevel: 'error',
      reportable: true,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      title: 'Service unavailable',
      type: problemTypes.dependencyFailure,
    });
  }
}
