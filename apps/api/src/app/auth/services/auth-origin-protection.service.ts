import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthConfigService } from './auth-config.service';

interface OriginAwareRequest {
  header(name: string): string | undefined;
}

@Injectable()
export class AuthOriginProtectionService {
  constructor(private readonly config: AuthConfigService) {}

  assertTrustedOrigin(request: Readonly<OriginAwareRequest>, action: string): void {
    const origin = this.readRequestOrigin(request);
    if (!origin) {
      throw new ForbiddenException(`${action} requires a trusted browser origin.`);
    }

    if (!this.allowedOrigins.has(origin)) {
      throw new ForbiddenException(`${action} is not allowed from this origin.`);
    }
  }

  private get allowedOrigins(): ReadonlySet<string> {
    return new Set(
      this.config.allowedCorsOrigins.map((origin) => {
        const url = new URL(origin);
        return url.origin;
      }),
    );
  }

  private readRequestOrigin(request: Readonly<OriginAwareRequest>): string | undefined {
    const originHeader = request.header('origin');
    if (originHeader) {
      return this.normalizeOrigin(originHeader);
    }

    const refererHeader = request.header('referer');
    if (!refererHeader) {
      return undefined;
    }

    return this.normalizeOrigin(refererHeader);
  }

  private normalizeOrigin(value: string): string | undefined {
    try {
      return new URL(value).origin;
    } catch {
      return undefined;
    }
  }
}
