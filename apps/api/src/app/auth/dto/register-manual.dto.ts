import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { RegisterManualRequest } from '@org/types';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

export class RegisterManualDto implements RegisterManualRequest {
  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @NormalizeText({ lowercase: true })
  @NoControlCharacters()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(256)
  password!: string;
}
