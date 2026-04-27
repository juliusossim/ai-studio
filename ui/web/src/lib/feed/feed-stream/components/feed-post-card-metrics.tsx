import type { FeedItemResponse } from '@org/types';
import type { ReactElement } from 'react';
import { formatMetric } from '../../feed-utils/feed.utils';
import { FeedPostCardMetric } from './feed-post-card-metric';

export function FeedPostCardMetrics({
  item,
  likeCount,
}: Readonly<{
  item: FeedItemResponse;
  likeCount: number;
}>): ReactElement {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-white/10 bg-white/6 p-3 text-center">
      <FeedPostCardMetric label="Likes" value={formatMetric(likeCount)} />
      <FeedPostCardMetric label="Saves" value={formatMetric(item.content.engagement.saves)} />
      <FeedPostCardMetric label="Shares" value={formatMetric(item.content.engagement.shares)} />
    </div>
  );
}
