import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { LoginManualRequest } from '@org/types';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

export class LoginManualDto implements LoginManualRequest {
  @NormalizeText({ lowercase: true })
  @NoControlCharacters()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  password!: string;
}
