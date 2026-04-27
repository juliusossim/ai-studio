import { Badge, Button, cn } from '@org/ui-primitives';
import { Heart } from 'lucide-react';
import type { ReactElement } from 'react';
import type { PropertyCardItem, PropertyCardSettings } from '../property-card.types';

export function PropertyCardHeader({
  isSaved,
  listing,
  onSave,
  settings,
}: Readonly<{
  isSaved: boolean;
  listing: PropertyCardItem;
  onSave?: (listing: PropertyCardItem) => void;
  settings: PropertyCardSettings;
}>): ReactElement {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
      <div className="flex flex-wrap gap-2">
        {settings.showBadges
          ? (listing.badges?.map((badge) => (
              <Badge
                key={badge}
                className="rounded-full bg-slate-950/55 px-3 py-1 text-[11px] tracking-[0.18em] text-white backdrop-blur-xl"
              >
                {badge}
              </Badge>
            )) ?? null)
          : null}
      </div>

      {settings.showSaveButton ? (
        <Button
          type="button"
          aria-label={isSaved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-slate-950/45 p-0 text-white transition-colors hover:bg-slate-950/65"
          onClick={() => onSave?.(listing)}
          variant="ghost"
        >
          <Heart className={cn('h-4 w-4', isSaved ? 'fill-rose-500 text-rose-500' : '')} />
        </Button>
      ) : null}
    </div>
  );
}
