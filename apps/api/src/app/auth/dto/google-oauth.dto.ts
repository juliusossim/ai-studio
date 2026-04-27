import { IsString, IsUrl, MinLength } from 'class-validator';
import type { GoogleOAuthCallbackRequest, GoogleOAuthStartRequest } from '@org/types';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

export class GoogleOAuthStartDto implements GoogleOAuthStartRequest {
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsUrl({ require_tld: false })
  redirectUri!: string;
}

export class GoogleOAuthCallbackDto implements GoogleOAuthCallbackRequest {
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(8)
  code!: string;

  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(16)
  state!: string;

  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsUrl({ require_tld: false })
  redirectUri!: string;
}
