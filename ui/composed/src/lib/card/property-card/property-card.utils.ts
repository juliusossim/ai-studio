import type { BrandBadgeItem } from '../../badge';
import type { PropertyCardItem, PropertyCardSettings } from './property-card.types';

const defaultSettings: PropertyCardSettings = {
  highlight: false,
  showBadges: true,
  showTags: true,
  showStats: true,
  showSaveButton: true,
  showPrimaryAction: false,
  showCarouselNavigation: true,
  showCarouselIndicators: false,
};

export function resolvePropertyCardSettings(settings?: PropertyCardSettings): PropertyCardSettings {
  return {
    ...defaultSettings,
    ...settings,
  };
}

export function readPropertyTagBrands(
  listing: Readonly<PropertyCardItem>,
): readonly BrandBadgeItem[] {
  return listing.tagBrands && listing.tagBrands.length > 0
    ? listing.tagBrands
    : (listing.tags ?? []).map((tag) => ({
        id: `${listing.id}-${tag}`,
        name: tag,
        className: 'text-white/78',
      }));
}
