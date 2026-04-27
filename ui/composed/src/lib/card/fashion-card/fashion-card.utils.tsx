import { defaultFashionCardSettings } from './fashion-card.constants';
import type { FashionCardSettings } from './fashion-card.types';

export function resolveFashionCardSettings(settings?: FashionCardSettings): FashionCardSettings {
  return {
    ...defaultFashionCardSettings,
    ...settings,
  };
}
