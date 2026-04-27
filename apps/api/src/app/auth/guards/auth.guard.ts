import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestContextService } from '../../telemetry/request-context/request-context.service';
import type { AuthenticatedRequest } from '../auth.types';

interface HeaderRequest extends AuthenticatedRequest {
  header(name: string): string | undefined;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly requestContext: RequestContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HeaderRequest>();
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    request.user = this.authService.verifyAccessToken(authorization.slice('Bearer '.length));
    this.requestContext.setUserId(request.user.id);
    return true;
  }
}
