import { Injectable } from '@nestjs/common';
import { getEnv, getEnvironment, getEnvBoolean, getEnvInteger, getEnvList } from '@org/config';

@Injectable()
export class AuthConfigService {
  readonly accessTokenTtlSeconds = getEnvInteger('AUTH_ACCESS_TOKEN_TTL_SECONDS', 900) ?? 900;
  readonly refreshTokenTtlSeconds =
    getEnvInteger('AUTH_REFRESH_TOKEN_TTL_SECONDS', 60 * 60 * 24 * 30) ?? 60 * 60 * 24 * 30;
  readonly googleOAuthStateTtlSeconds = getEnvInteger('GOOGLE_OAUTH_STATE_TTL_SECONDS', 600) ?? 600;
  readonly cookieSecure = getEnvBoolean('AUTH_COOKIE_SECURE', getEnvironment() === 'production');
  readonly cookieSameSite = this.readSameSite('AUTH_COOKIE_SAME_SITE', 'lax');

  constructor() {
    if (this.cookieSameSite === 'none' && !this.cookieSecure) {
      throw new Error('AUTH_COOKIE_SAME_SITE=none requires AUTH_COOKIE_SECURE=true.');
    }
  }

  get allowedCorsOrigins(): string[] {
    const configuredOrigins = getEnvList('AUTH_CORS_ORIGINS');
    if (configuredOrigins.length > 0) {
      return configuredOrigins;
    }

    const webOrigin = getEnvList('WEB_ORIGIN');
    return webOrigin.length > 0 ? webOrigin : ['http://localhost:4200'];
  }

  get jwtSecret(): string {
    return this.readRequiredSecret(
      'AUTH_JWT_SECRET',
      'ripples-dev-auth-secret-change-me-before-production',
    );
  }

  get passwordPepper(): string {
    return this.readRequiredSecret(
      'AUTH_PASSWORD_PEPPER',
      'ripples-dev-password-pepper-change-me-before-production',
    );
  }

  get googleClientId(): string | undefined {
    return getEnv('GOOGLE_CLIENT_ID');
  }

  get googleClientSecret(): string | undefined {
    return getEnv('GOOGLE_CLIENT_SECRET');
  }

  private readSameSite(
    key: string,
    fallback: 'lax' | 'strict' | 'none',
  ): 'lax' | 'strict' | 'none' {
    const value = process.env[key]?.toLowerCase();
    if (value === 'lax' || value === 'strict' || value === 'none') {
      return value;
    }

    return fallback;
  }

  private readRequiredSecret(key: string, developmentFallback: string): string {
    const value = getEnv(key);
    if (value) {
      return value;
    }
    if (getEnvironment() === 'production') {
      throw new Error(`Missing required production secret: ${key}`);
    }

    return developmentFallback;
  }
}
