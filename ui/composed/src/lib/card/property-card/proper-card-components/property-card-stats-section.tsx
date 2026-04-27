import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { PropertyCardStructuredStats } from './property-card-structured-stats';
import type {
  PropertyCardItem,
  PropertyCardSettings,
  PropertyCardStat,
} from '../property-card.types';

function PropertyCardStatItem({ stat }: Readonly<{ stat: PropertyCardStat }>): ReactElement {
  return (
    <div className="space-y-1">
      <p className="text-white/48">{stat.label}</p>
      <p className="font-medium text-white/84">{stat.value}</p>
    </div>
  );
}

export function PropertyCardStatsSection({
  listing,
  settings,
}: Readonly<{
  listing: PropertyCardItem;
  settings: PropertyCardSettings;
}>): ReactElement | null {
  if (!settings.showStats) {
    return null;
  }

  const structuredStats = <PropertyCardStructuredStats listing={listing} />;

  if (structuredStats) {
    return structuredStats;
  }

  if (!listing.stats || listing.stats.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid gap-3 rounded-[1.25rem] border border-white/8 bg-slate-950/22 p-4 text-sm text-white/76',
        listing.stats.length >= 3 ? 'grid-cols-3' : 'grid-cols-2',
      )}
    >
      {listing.stats.map((stat) => (
        <PropertyCardStatItem key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
