import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

function parseOptionalInteger(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  return value;
}

export class FeedQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseOptionalInteger(value))
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cursor?: number;

  @IsOptional()
  @Transform(({ value }) => parseOptionalInteger(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
