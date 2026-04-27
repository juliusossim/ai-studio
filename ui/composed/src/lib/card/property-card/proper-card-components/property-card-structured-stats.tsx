import { Bath, BedDouble, Square } from 'lucide-react';
import type { ReactElement } from 'react';
import type { PropertyCardItem } from '../property-card.types';

export function PropertyCardStructuredStats({
  listing,
}: Readonly<{ listing: PropertyCardItem }>): ReactElement | null {
  if (!listing.propertyStats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] border border-white/8 bg-slate-950/22 p-4 text-sm text-white/76">
      <div className="space-y-1">
        <p className="text-white/48">Beds</p>
        <div className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-amber-100" />
          <span>{listing.propertyStats.beds ?? '-'}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-white/48">Baths</p>
        <div className="flex items-center gap-2">
          <Bath className="h-4 w-4 text-emerald-200" />
          <span>{listing.propertyStats.baths ?? '-'}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-white/48">Area</p>
        <div className="flex items-center gap-2">
          <Square className="h-4 w-4 text-sky-100" />
          <span>{listing.propertyStats.area ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}
