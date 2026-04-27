import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Button, Item, ItemContent, ItemTitle, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { MoreInfoText } from '../typography';
import type { ErrorMessageProps } from './error-message.types';

export function ErrorMessage({
  message = 'An error occurred. Please try again.',
  imageAlt = 'Error illustration',
  imageSrc,
  className,
  children,
  onRetry,
  onGoBack,
}: Readonly<ErrorMessageProps>): ReactElement {
  return (
    <div
      className={cn(
        'flex min-h-50 w-full flex-col items-center justify-center bg-stone-100 text-center text-slate-700',
        className,
      )}
    >
      <div className="flex max-w-1/2 flex-col items-center gap-4">
        {imageSrc ? (
          <img alt={imageAlt} className="h-28 w-28 object-contain" src={imageSrc} />
        ) : null}
        {children ? (
          (children as ReactElement)
        ) : (
          <Item className="border-fuchsia-200 bg-background/70" variant="outline">
            <ItemContent>
              <ItemTitle className="text-lg font-medium tracking-tight text-fuchsia-700">
                {message}
              </ItemTitle>
            </ItemContent>
          </Item>
        )}
        {onRetry || onGoBack ? (
          <div className="flex w-full justify-between">
            {onRetry ? (
              <MoreInfoText
                content="Retry"
                title={
                  <Button aria-label="Retry" onClick={onRetry} variant="secondary">
                    <RefreshCcw color="black" size={16} />
                  </Button>
                }
              >
                <span className="text-xs text-sky-500">Try again</span>
              </MoreInfoText>
            ) : null}
            {onGoBack ? (
              <MoreInfoText
                content="Go back"
                title={
                  <Button aria-label="Go back" onClick={onGoBack} variant="secondary">
                    <ArrowLeft color="black" size={16} />
                  </Button>
                }
              >
                <span className="text-xs text-emerald-500">Return to safety</span>
              </MoreInfoText>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
