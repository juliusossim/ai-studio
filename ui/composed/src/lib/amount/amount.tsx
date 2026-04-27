import { ItemContent, cn } from '@org/ui-primitives';
import { formatCurrency } from '@org/utils';
import type { ReactElement } from 'react';
import type { AmountProps } from './amount.types';

function calculateReferencePrice({
  discount,
  increment,
  originalPrice,
  price,
}: Readonly<Pick<AmountProps, 'discount' | 'increment' | 'originalPrice' | 'price'>>):
  | number
  | null {
  if (typeof originalPrice === 'number' && originalPrice > 0) {
    return originalPrice;
  }

  if (typeof discount === 'number' && discount > 0 && discount < 100) {
    return price / (1 - discount / 100);
  }

  if (typeof increment === 'number' && increment > 0) {
    return price / (1 + increment / 100);
  }

  return null;
}

function resolveDiscount(
  price: number,
  referencePrice: number | null,
  discount?: number,
): number | null {
  if (typeof discount === 'number') {
    return discount;
  }

  if (typeof referencePrice === 'number' && referencePrice > 0) {
    return Math.round((1 - price / referencePrice) * 100);
  }

  return null;
}

function resolveIncrement(
  price: number,
  referencePrice: number | null,
  increment?: number,
): number | null {
  if (typeof increment === 'number') {
    return increment;
  }

  if (typeof referencePrice === 'number' && referencePrice > 0) {
    return ((price - referencePrice) / referencePrice) * 100;
  }

  return null;
}

export function Amount({
  price,
  currency,
  locale,
  originalPrice,
  discount,
  increment,
  showIncrement = true,
  showOriginalPrice = true,
  showDiscount = true,
  className,
  valueClassName,
  originalPriceClassName,
  discountClassName,
  incrementClassName,
}: Readonly<AmountProps>): ReactElement {
  const formattedPrice = formatCurrency(price, currency, locale);
  const referencePrice = calculateReferencePrice({
    discount,
    increment,
    originalPrice,
    price,
  });
  const formattedOriginalPrice =
    typeof referencePrice === 'number' ? formatCurrency(referencePrice, currency, locale) : null;
  const resolvedDiscount = resolveDiscount(price, referencePrice, discount);
  const resolvedIncrement = resolveIncrement(price, referencePrice, increment);

  return (
    <ItemContent className={cn('flex flex-row items-center gap-2', className)}>
      <p className={cn('text-sm font-medium text-foreground', valueClassName)}>{formattedPrice}</p>
      {showOriginalPrice && formattedOriginalPrice ? (
        <p className={cn('text-sm text-muted-foreground line-through', originalPriceClassName)}>
          {formattedOriginalPrice}
        </p>
      ) : null}
      {showDiscount && typeof resolvedDiscount === 'number' && resolvedDiscount > 0 ? (
        <p className={cn('text-sm text-destructive', discountClassName)}>-{resolvedDiscount}%</p>
      ) : null}
      {showIncrement && typeof resolvedIncrement === 'number' && resolvedIncrement > 0 ? (
        <p className={cn('text-sm text-emerald-600', incrementClassName)}>
          +{resolvedIncrement.toFixed(2)}%
        </p>
      ) : null}
    </ItemContent>
  );
}
