import { Button, CardHeader, CardTitle } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { Amount } from '../../../amount';
import { TruncatedText } from '../../../typography';
import type { FashionCardProduct, FashionCardSettings } from '../fashion-card.types';

export function FashionCardHeader({
  onPrimaryAction,
  product,
  settings,
}: Readonly<{
  onPrimaryAction?: (product: FashionCardProduct) => void;
  product: FashionCardProduct;
  settings: FashionCardSettings;
}>): ReactElement {
  return (
    <CardHeader className="gap-0">
      <CardTitle className="space-y-2">
        {settings.showTitle ? (
          <div className="flex w-full flex-row justify-between">
            <h3 className="mb-2 text-lg font-semibold text-foreground">{product.name}</h3>
          </div>
        ) : null}
        {settings.showPrice ? (
          <Amount
            {...product.price}
            locale={settings.locale}
            showDiscount={settings.showDiscountPercentage}
            showIncrement={settings.showIncrement}
            showOriginalPrice={settings.showOriginalPrice}
          />
        ) : null}
      </CardTitle>
      {settings.showDescription ? (
        <TruncatedText
          className="text-sm text-muted-foreground"
          lineClamp={settings.descriptionLineClamp}
          text={product.description}
          tooltipSide="bottom"
        />
      ) : null}
      {settings.showActions ? (
        <div className="mt-3 flex justify-end">
          <Button
            className="cursor-pointer hover:text-primary/80"
            onClick={() => onPrimaryAction?.(product)}
            variant="secondary"
          >
            {settings.actionContent}
          </Button>
        </div>
      ) : null}
    </CardHeader>
  );
}
