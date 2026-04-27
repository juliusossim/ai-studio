export abstract class ErrorReporterService {
  abstract captureException(
    exception: Error,
    context?: Readonly<Record<string, unknown>>,
  ): void | Promise<void>;

  abstract shutdown(): void | Promise<void>;
}
