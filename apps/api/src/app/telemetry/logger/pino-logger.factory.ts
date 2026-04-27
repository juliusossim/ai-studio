import pino, { type Bindings, type Logger as PinoLogger, type LoggerOptions } from 'pino';
import { getEnv, getEnvironment } from '@org/config';

export function createPinoLogger(): PinoLogger {
  const environment = getEnvironment();
  const options: LoggerOptions = {
    level: getEnv('LOG_LEVEL') ?? (environment === 'production' ? 'info' : 'debug'),
    base: {
      service: 'ripples-api',
      environment,
    },
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      bindings(bindings: Bindings): Bindings {
        return bindings;
      },
      level(label: string): Bindings {
        return { level: label };
      },
    },
    redact: {
      paths: [
        'authorization',
        'headers.authorization',
        'headers.cookie',
        'req.headers.authorization',
        'req.headers.cookie',
        'request.headers.authorization',
        'request.headers.cookie',
        'password',
        'body.password',
        'refreshToken',
        'body.refreshToken',
        'accessToken',
        'body.accessToken',
        'code',
        'body.code',
      ],
      censor: '[Redacted]',
    },
  };

  return pino(options);
}
