import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { PropertyMediaAttachmentRole, PropertyStatus } from '@org/types';
import { NoControlCharacters } from '../../common/input/no-control-characters.validator';
import { NormalizeText } from '../../common/input/normalize-text.transform';

const listingStatuses: readonly PropertyStatus[] = [
  'draft',
  'active',
  'under-offer',
  'sold',
  'archived',
];
const propertyMediaRoles: readonly PropertyMediaAttachmentRole[] = ['cover', 'gallery'];

export class PropertyLocationDto {
  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  city!: string;

  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  country!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class PropertyPriceDto {
  @IsNumber()
  amount!: number;

  @NormalizeText({ uppercase: true })
  @NoControlCharacters()
  @IsString()
  @Matches(/^[a-zA-Z]{3}$/)
  currency!: string;
}

export class PropertyMediaDto {
  @IsUUID()
  mediaAssetId!: string;

  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  alt!: string;

  @IsOptional()
  @IsIn(propertyMediaRoles)
  role?: PropertyMediaAttachmentRole;
}

export class CreatePropertyDto {
  @NormalizeText()
  @NoControlCharacters()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @NormalizeText({ preserveLineBreaks: true })
  @NoControlCharacters()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PropertyLocationDto)
  location!: PropertyLocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PropertyPriceDto)
  price!: PropertyPriceDto;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => PropertyMediaDto)
  media!: PropertyMediaDto[];

  @IsOptional()
  @IsIn(listingStatuses)
  status?: PropertyStatus;
}
