import type { ReactNode } from 'react';
import type { AmountProps } from '../../amount';
import type { BrandBadgeItem } from '../../badge';
import type { ProductCarouselProduct } from '../../carousel';
import type {
  SocialInteractionAction,
  SocialInteractionCounts,
  SocialInteractionState,
} from '../../social-interactions';
import type { TruncatedTextProps } from '../../typography';
import type { BadgeVariant } from '@org/ui-primitives';

export type FashionCardProduct = Readonly<
  ProductCarouselProduct & {
    description: string;
    price: AmountProps;
    rating?: number;
    soldLabel?: string;
    brands?: readonly BrandBadgeItem[];
    interactionCounts?: SocialInteractionCounts;
    interactionState?: SocialInteractionState;
    detailHref?: string;
  }
>;

export type FashionCardSettings = Readonly<{
  showBrandCarousel?: boolean;
  showRating?: boolean;
  showSocialInteractions?: boolean;
  showSoldText?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  showTitle?: boolean;
  locale?: string;
  descriptionLineClamp: NonNullable<TruncatedTextProps['lineClamp']>;
  showOriginalPrice?: boolean;
  showDiscountPercentage?: boolean;
  showIncrement?: boolean;
  actionContent?: ReactNode;
  badgeVariant?: BadgeVariant;
  showViewAction?: boolean;
  viewActionContent?: ReactNode;
}>;

export type FashionCardProps = Readonly<{
  product: FashionCardProduct;
  settings?: FashionCardSettings;
  onProductClick?: (product: FashionCardProduct) => void;
  onPrimaryAction?: (product: FashionCardProduct) => void;
  onViewAction?: (product: FashionCardProduct) => void;
  onInteraction?: (
    action: SocialInteractionAction,
    product: FashionCardProduct,
    extra?: Record<string, unknown>,
  ) => void;
}>;
