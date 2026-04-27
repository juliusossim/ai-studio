import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenCookieService } from './cookies/refresh-token-cookie.service';
import { GoogleOAuthService } from './google/google-oauth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { OAuthStateRepository } from './repositories/oauth-state.repository';
import { SessionsRepository } from './repositories/sessions.repository';
import { UsersRepository } from './repositories/users.repository';
import { AuthConfigService } from './services/auth-config.service';
import { AuthOriginProtectionService } from './services/auth-origin-protection.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthConfigService,
    AuthOriginProtectionService,
    UsersRepository,
    SessionsRepository,
    OAuthStateRepository,
    PasswordService,
    TokenService,
    GoogleOAuthService,
    RefreshTokenCookieService,
    AuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
