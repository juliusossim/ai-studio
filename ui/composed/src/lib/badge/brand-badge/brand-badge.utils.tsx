import type { KeyboardEvent } from 'react';
import type { BrandBadgeItem } from './brand-badge.types';

export interface BrandKeyDownContext {
  readonly brand: BrandBadgeItem;
  readonly clickable: boolean;
  readonly onClick?: (brand: BrandBadgeItem) => void;
  readonly onKeyDown?: (event: KeyboardEvent<HTMLDivElement>, brand: BrandBadgeItem) => void;
}

function isActivationKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

export function handleBrandBadgeKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  context: Readonly<BrandKeyDownContext>,
): void {
  if (!context.clickable) {
    return;
  }

  context.onKeyDown?.(event, context.brand);

  if (isActivationKey(event.key)) {
    event.preventDefault();
    context.onClick?.(context.brand);
  }
}
