import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

export class PropertyInteractionDto {
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  sessionId!: string;

  @IsOptional()
  @NormalizeText({ collapseWhitespace: false })
  @NoControlCharacters()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  userId?: string;
}
