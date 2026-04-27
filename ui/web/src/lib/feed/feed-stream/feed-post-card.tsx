import { Card } from '@org/ui-primitives';
import type { PropertyInteractionName } from '@org/data';
import { useEffect, useState, type ReactElement } from 'react';
import type { FeedItemResponse } from '@org/types';
import { ProductCarousel } from './product-carousel';
import { readFeedStreamItem } from '../feed-utils/feed.utils';
import {
  FeedPostCardActionButtons,
  FeedPostCardBody,
  FeedPostCardHeader,
  FeedPostCardMetrics,
} from './components';

export interface FeedPostCardProps {
  readonly isInteracting?: boolean;
  readonly item: FeedItemResponse;
  readonly onInteraction: (interaction: PropertyInteractionName, propertyId: string) => void;
}

export function FeedPostCard({
  isInteracting = false,
  item,
  onInteraction,
}: Readonly<FeedPostCardProps>): ReactElement {
  const post = readFeedStreamItem(item);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.content.engagement.likes);

  useEffect(() => {
    setIsLiked(false);
    setLikeCount(item.content.engagement.likes);
  }, [item.content.engagement.likes, item.id]);

  function likeOnce(): void {
    if (isLiked) {
      return;
    }

    setIsLiked(true);
    setLikeCount((current) => current + 1);
    onInteraction('like', post.propertyId);
  }

  function toggleLike(): void {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((current) => Math.max(0, current - 1));
      return;
    }

    likeOnce();
  }

  return (
    <Card className="overflow-hidden rounded-4xl border-white/8 bg-[linear-gradient(180deg,#08172b_0%,#0b203a_100%)] p-0 text-white shadow-[0_24px_100px_rgba(4,11,24,0.18)]">
      <div className="space-y-5 p-5 sm:p-6">
        <FeedPostCardHeader post={post} />

        <ProductCarousel
          isLiked={isLiked}
          item={post}
          onDoubleLike={likeOnce}
          onToggleLike={toggleLike}
        />

        <div className="space-y-4 px-1 pb-1">
          <FeedPostCardBody post={post} />
          <FeedPostCardMetrics item={item} likeCount={likeCount} />
          <FeedPostCardActionButtons
            isInteracting={isInteracting}
            isLiked={isLiked}
            onInteraction={onInteraction}
            onToggleLike={toggleLike}
            post={post}
          />
        </div>
      </div>
    </Card>
  );
}
