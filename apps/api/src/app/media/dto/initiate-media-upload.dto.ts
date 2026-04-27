import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import type { MediaAssetIntent, MediaUploadSource } from '@org/types';
import { NormalizeText } from '../../common/input/normalize-text.transform';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';

const mediaAssetIntentValues = [
  'listing',
  'catalog',
  'post',
  'profile',
  'event-cover',
  'live',
] as const satisfies readonly MediaAssetIntent[];

const mediaUploadSourceValues = [
  'device',
  'dropbox',
  'google-drive',
  'direct-url',
  'generated',
] as const satisfies readonly MediaUploadSource[];

export class InitiateMediaUploadDto {
  @IsIn(mediaAssetIntentValues)
  intent!: MediaAssetIntent;

  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  mimeType!: string;

  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  originalName!: string;

  @IsInt()
  @Min(1)
  sizeBytes!: number;

  @IsIn(mediaUploadSourceValues)
  source!: MediaUploadSource;
}
