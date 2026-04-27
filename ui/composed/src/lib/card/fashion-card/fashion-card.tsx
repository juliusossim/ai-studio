import { Card } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { ProductCarousel } from '../../carousel';
import { FashionCardBrandSection, FashionCardFooter, FashionCardHeader } from './components';
import { resolveFashionCardSettings } from './fashion-card.utils';
import type { FashionCardProps } from './fashion-card.types';

export function FashionCard({
  product,
  settings,
  onProductClick,
  onPrimaryAction,
  onViewAction,
  onInteraction,
}: Readonly<FashionCardProps>): ReactElement {
  const resolvedSettings = resolveFashionCardSettings(settings);

  return (
    <Card className="hover-glow w-full max-w-sm gap-0 overflow-hidden rounded-lg border-0 pt-0 duration-300 hover:transition-shadow">
      <ProductCarousel
        showIndicators={false}
        product={product}
        onImageClick={() => onProductClick?.(product)}
      />
      <FashionCardHeader
        onPrimaryAction={onPrimaryAction}
        product={product}
        settings={resolvedSettings}
      />
      <FashionCardBrandSection product={product} settings={resolvedSettings} />
      <FashionCardFooter
        onInteraction={onInteraction}
        onViewAction={onViewAction}
        product={product}
        settings={resolvedSettings}
      />
    </Card>
  );
}
