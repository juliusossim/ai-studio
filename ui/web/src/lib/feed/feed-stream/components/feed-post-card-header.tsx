import { Badge } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';

export function FeedPostCardHeader({ post }: Readonly<{ post: FeedStreamItem }>): ReactElement {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white">
          {post.authorInitials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">{post.authorName}</p>
            <Badge className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
              {post.rankingLabel}
            </Badge>
          </div>
          <p className="text-sm text-white/58">
            {post.authorRole} • {post.createdAtLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/72 backdrop-blur-xl">
        <span>{post.viewsLabel}</span>
        <span className="text-white/40">•</span>
        <span>score {post.scoreLabel}</span>
      </div>
    </div>
  );
}
