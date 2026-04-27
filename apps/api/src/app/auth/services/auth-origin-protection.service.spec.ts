import { AuthConfigService } from './auth-config.service';
import { AuthOriginProtectionService } from './auth-origin-protection.service';

describe('AuthOriginProtectionService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      AUTH_CORS_ORIGINS: 'https://app.ripples.example,https://studio.ripples.example',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('allows requests from configured origins', () => {
    const service = new AuthOriginProtectionService(new AuthConfigService());

    expect(() =>
      service.assertTrustedOrigin(
        {
          header(name) {
            return name === 'origin' ? 'https://app.ripples.example' : undefined;
          },
        },
        'Token refresh',
      ),
    ).not.toThrow();
  });

  it('rejects requests from unknown origins', () => {
    const service = new AuthOriginProtectionService(new AuthConfigService());

    expect(() =>
      service.assertTrustedOrigin(
        {
          header(name) {
            return name === 'origin' ? 'https://attacker.example' : undefined;
          },
        },
        'Token refresh',
      ),
    ).toThrow('Token refresh is not allowed from this origin.');
  });
});
