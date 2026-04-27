import { Star } from 'lucide-react';
import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { StarRatingProps } from './star-rating.types';

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className,
  showValue = false,
}: Readonly<StarRatingProps>): ReactElement {
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const fillPercentage = Math.max(0, Math.min(100, (clampedRating - index) * 100));

          return (
            <div
              key={`star-${index + 1}`}
              className="relative"
              style={{ height: size, width: size }}
            >
              <Star className="absolute text-muted-foreground/30" size={size} strokeWidth={1.5} />
              <div
                className="absolute overflow-hidden"
                style={{ height: size, width: `${fillPercentage}%` }}
              >
                <Star className="fill-amber-400 text-amber-400" size={size} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>
      {showValue ? (
        <span className="ml-1 text-sm text-muted-foreground">{clampedRating.toFixed(1)}</span>
      ) : null}
    </div>
  );
}
