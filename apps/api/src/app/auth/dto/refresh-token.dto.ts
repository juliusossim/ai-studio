import { IsOptional, IsString, MinLength } from 'class-validator';
import type { LogoutRequest, RefreshTokenRequest } from '@org/types';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

export class RefreshTokenDto implements RefreshTokenRequest {
  @IsOptional()
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(20)
  refreshToken?: string;
}

export class LogoutDto implements LogoutRequest {
  @IsOptional()
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(20)
  refreshToken?: string;
}
