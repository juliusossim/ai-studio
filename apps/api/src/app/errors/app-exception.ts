import { HttpException } from '@nestjs/common';

export interface AppExceptionOptions {
  readonly detail: string;
  readonly logLevel?: 'error' | 'warn';
  readonly reportable?: boolean;
  readonly status: number;
  readonly title: string;
  readonly type: string;
}

export class AppException extends HttpException {
  readonly detail: string;
  readonly logLevel: 'error' | 'warn';
  readonly reportable: boolean;
  readonly title: string;
  readonly type: string;

  constructor(options: Readonly<AppExceptionOptions>) {
    super(options.detail, options.status);
    this.detail = options.detail;
    this.logLevel = options.logLevel ?? (options.status >= 500 ? 'error' : 'warn');
    this.reportable = options.reportable ?? options.status >= 500;
    this.title = options.title;
    this.type = options.type;
  }
}
