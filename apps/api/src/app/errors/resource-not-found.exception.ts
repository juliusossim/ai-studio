import { HttpStatus } from '@nestjs/common';
import { problemTypes } from '../telemetry/http/problem-details/problem-type.constants';
import { AppException } from './app-exception';

export class ResourceNotFoundException extends AppException {
  constructor(detail: string) {
    super({
      detail,
      reportable: false,
      status: HttpStatus.NOT_FOUND,
      title: 'Resource not found',
      type: problemTypes.notFound,
    });
  }
}
