import { Badge } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';

export function FeedPostCardBody({ post }: Readonly<{ post: FeedStreamItem }>): ReactElement {
  return (
    <div className="space-y-4 px-1 pb-1">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/58">
          <Badge className="rounded-full bg-amber-300/16 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-200">
            {post.surfaceLabel}
          </Badge>
          <Badge className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/78">
            {post.locationLabel ?? 'Market signal'}
          </Badge>
          <span>{post.statusLabel}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/78">{post.description}</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
        <p className="text-sm font-semibold text-white">Why this is surfacing</p>
        <p className="mt-2 text-sm leading-6 text-white/66">{post.recommendationSummary}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-amber-200">
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
