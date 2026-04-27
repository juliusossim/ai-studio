import { HttpStatus } from '@nestjs/common';
import { problemTypes } from '../telemetry/http/problem-details/problem-type.constants';
import { AppException } from './app-exception';

export class InternalOperationException extends AppException {
  constructor(detail = 'The server could not process the request.') {
    super({
      detail,
      logLevel: 'error',
      reportable: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      type: problemTypes.internalServerError,
    });
  }
}
