import { Button, cn } from '@org/ui-primitives';
import { Heart } from 'lucide-react';
import type { ReactElement } from 'react';
import { stopProductCarouselEventPropagation } from '../product-carousel.utils';

export function ProductCarouselLikeButton({
  isLiked,
  itemTitle,
  onToggleLike,
}: Readonly<{
  isLiked: boolean;
  itemTitle: string;
  onToggleLike: () => void;
}>): ReactElement {
  return (
    <div className="absolute right-4 top-4 z-20">
      <Button
        aria-label={isLiked ? `Unlike ${itemTitle}` : `Like ${itemTitle}`}
        className="h-11 w-11 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
        onClick={(event) => {
          stopProductCarouselEventPropagation(event);
          onToggleLike();
        }}
        size="sm"
        variant="outline"
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors',
            isLiked ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-white',
          )}
        />
      </Button>
    </div>
  );
}
