import { Button, CardFooter } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { SocialInteractions } from '../../../social-interactions';
import type { SocialInteractionAction } from '../../../social-interactions';
import { StarRating } from '../../../stars';
import { SmallText, Text } from '../../../typography';
import type { FashionCardProduct, FashionCardSettings } from '../fashion-card.types';
import { FashionCardViewActionLink } from './fashion-card-view-action-link';

const SOLD_TEXT = 'sold recently';

export function FashionCardFooter({
  onInteraction,
  onViewAction,
  product,
  settings,
}: Readonly<{
  onInteraction?: (
    action: SocialInteractionAction,
    product: FashionCardProduct,
    extra?: Record<string, unknown>,
  ) => void;
  onViewAction?: (product: FashionCardProduct) => void;
  product: FashionCardProduct;
  settings: FashionCardSettings;
}>): ReactElement {
  return (
    <CardFooter className="mt-1 flex-col gap-0">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        {settings.showRating && typeof product.rating === 'number' ? (
          <StarRating className="my-2" rating={product.rating} showValue size={12} />
        ) : (
          <span />
        )}
        {settings.showSoldText ? (
          <Text className="flex flex-row flex-nowrap gap-0.5 text-sm text-muted-foreground">
            <SmallText role="img" aria-label="hot">
              <span aria-label="hot" role="img">
                🔥
              </span>
            </SmallText>
            <SmallText>{product.soldLabel ?? '6k+'} </SmallText>
            <SmallText>{SOLD_TEXT}</SmallText>
          </Text>
        ) : null}
        {settings.showViewAction ? (
          <Button onClick={() => onViewAction?.(product)} variant="default">
            {product.detailHref ? (
              <FashionCardViewActionLink
                href={product.detailHref}
                label={settings.viewActionContent ?? 'View'}
              />
            ) : (
              (settings.viewActionContent ?? 'View')
            )}
          </Button>
        ) : null}
      </div>

      {settings.showSocialInteractions ? (
        <SocialInteractions
          counts={product.interactionCounts}
          onInteraction={(action, extra) => onInteraction?.(action, product, extra)}
          state={product.interactionState}
          variant="inline"
        />
      ) : null}
    </CardFooter>
  );
}
