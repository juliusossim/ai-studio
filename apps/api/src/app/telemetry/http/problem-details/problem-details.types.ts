export interface ProblemDetailsErrorItem {
  readonly detail: string;
  readonly field?: string;
}

export interface ProblemDetails {
  readonly detail: string;
  readonly errors?: readonly ProblemDetailsErrorItem[];
  readonly instance: string;
  readonly status: number;
  readonly title: string;
  readonly traceId?: string;
  readonly type: string;
}

export interface ProblemDetailsContext {
  readonly instance: string;
  readonly traceId?: string;
}

export interface ProblemDetailsResult {
  readonly body: ProblemDetails;
  readonly logLevel: 'error' | 'warn';
  readonly shouldReport: boolean;
  readonly status: number;
}
