import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { AuthResponse, AuthUser, GoogleOAuthStartResponse } from '@org/types';
import { AuthService } from './auth.service';
import { RefreshTokenCookieService } from './cookies/refresh-token-cookie.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { GoogleOAuthCallbackDto, GoogleOAuthStartDto } from './dto/google-oauth.dto';
import type { LoginManualDto } from './dto/login-manual.dto';
import type { LogoutDto, RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterManualDto } from './dto/register-manual.dto';
import { AuthGuard } from './guards/auth.guard';
import type {
  AuthenticatedUser,
  AuthSessionResult,
  CookieReader,
  HeaderWriter,
} from './auth.types';
import { AuthOriginProtectionService } from './services/auth-origin-protection.service';

interface OriginAwareCookieReader extends CookieReader {
  header(name: string): string | undefined;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authOriginProtection: AuthOriginProtectionService,
    private readonly refreshTokenCookieService: RefreshTokenCookieService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 10 * 60_000 } })
  async registerManual(
    @Body() input: RegisterManualDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(response, await this.authService.registerManual(input));
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 10 * 60_000 } })
  async loginManual(
    @Body() input: LoginManualDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(response, await this.authService.loginManual(input));
  }

  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 10 * 60_000 } })
  async refresh(
    @Body() input: RefreshTokenDto,
    @Req() request: OriginAwareCookieReader,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    const refreshToken = this.readRefreshToken(input.refreshToken, request, 'Token refresh');
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    return this.writeRefreshCookie(response, await this.authService.refresh(refreshToken));
  }

  @Post('logout')
  @Throttle({ default: { limit: 20, ttl: 10 * 60_000 } })
  async logout(
    @Body() input: LogoutDto,
    @Req() request: OriginAwareCookieReader,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<{ success: true }> {
    const refreshToken = this.readRefreshToken(input.refreshToken, request, 'Session logout');
    this.refreshTokenCookieService.clear(response);
    if (!refreshToken) {
      return { success: true };
    }

    return this.authService.logout(refreshToken);
  }

  @Post('oauth/google/start')
  @Throttle({ default: { limit: 20, ttl: 10 * 60_000 } })
  startGoogleOAuth(@Body() input: GoogleOAuthStartDto): Promise<GoogleOAuthStartResponse> {
    return this.authService.startGoogleOAuth(input.redirectUri);
  }

  @Post('oauth/google/callback')
  @Throttle({ default: { limit: 20, ttl: 10 * 60_000 } })
  async completeGoogleOAuth(
    @Body() input: GoogleOAuthCallbackDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(
      response,
      await this.authService.completeGoogleOAuth(input.code, input.state, input.redirectUri),
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUser> {
    return this.authService.getProfile(user.id);
  }

  private writeRefreshCookie(response: HeaderWriter, result: AuthSessionResult): AuthResponse {
    this.refreshTokenCookieService.write(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return result.response;
  }

  private readRefreshToken(
    inputToken: string | undefined,
    request: OriginAwareCookieReader,
    action: string,
  ): string | undefined {
    if (inputToken) {
      return inputToken;
    }

    const refreshToken = this.refreshTokenCookieService.read(request);
    if (!refreshToken) {
      return undefined;
    }

    this.authOriginProtection.assertTrustedOrigin(request, action);
    return refreshToken;
  }
}
