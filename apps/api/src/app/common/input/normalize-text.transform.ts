import { Transform } from 'class-transformer';
import { normalizeTextValue, type NormalizeTextOptions } from '@org/utils';

export function NormalizeText(options: Readonly<NormalizeTextOptions> = {}): PropertyDecorator {
  return Transform(({ value }) => normalizeTextValue(value, options));
}
