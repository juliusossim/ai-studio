import { Eye, Handshake } from 'lucide-react';
import type { FashionCardSettings } from './fashion-card.types';

export const defaultFashionCardSettings: FashionCardSettings = {
  showBrandCarousel: true,
  showRating: true,
  showSocialInteractions: true,
  showSoldText: true,
  showPrice: true,
  showDescription: true,
  showActions: true,
  showTitle: true,
  locale: 'en-NG',
  descriptionLineClamp: 2,
  showOriginalPrice: true,
  showDiscountPercentage: true,
  showIncrement: true,
  actionContent: <Handshake className="h-4 w-4" />,
  badgeVariant: 'outline',
  showViewAction: true,
  viewActionContent: <Eye className="h-4 w-4" />,
};
