import { HttpStatus } from '@nestjs/common';
import { problemTypes } from '../telemetry/http/problem-details/problem-type.constants';
import { AppException } from './app-exception';

export class ResourceConflictException extends AppException {
  constructor(detail: string) {
    super({
      detail,
      reportable: false,
      status: HttpStatus.CONFLICT,
      title: 'Conflict',
      type: problemTypes.conflict,
    });
  }
}
