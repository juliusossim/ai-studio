import { HttpStatus } from '@nestjs/common';
import { problemTypes } from '../telemetry/http/problem-details/problem-type.constants';
import { AppException } from './app-exception';

export class UnsupportedMediaException extends AppException {
  constructor(detail: string) {
    super({
      detail,
      reportable: false,
      status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      title: 'Unsupported media type',
      type: problemTypes.unsupportedMediaType,
    });
  }
}
