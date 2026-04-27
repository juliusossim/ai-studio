import { CardContent } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { BrandCarousel } from '../../../carousel';
import type { FashionCardProduct, FashionCardSettings } from '../fashion-card.types';

export function FashionCardBrandSection({
  product,
  settings,
}: Readonly<{
  product: FashionCardProduct;
  settings: FashionCardSettings;
}>): ReactElement {
  return (
    <CardContent className="mt-1 flex flex-row items-center gap-1">
      {settings.showBrandCarousel && product.brands?.length ? (
        <div className="max-w-60">
          <BrandCarousel
            autoplay
            pauseOnHover
            badgeVariant={settings.badgeVariant}
            brands={product.brands}
            showNavigation={false}
          />
        </div>
      ) : null}
    </CardContent>
  );
}
