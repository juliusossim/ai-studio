import { Button } from '@org/ui-primitives';
import type { PropertyInteractionName } from '@org/data';
import type { ReactElement } from 'react';
import type { FeedStreamItem } from '../../feed-utils/feed.utils';
import { readFeedPostActionClassName } from '../feed-post-card.utils';

const actionLabels: Record<PropertyInteractionName, string> = {
  like: 'Like',
  save: 'Save',
  share: 'Share',
  view: 'View',
};

export function FeedPostCardActionButtons({
  isInteracting,
  isLiked,
  onInteraction,
  onToggleLike,
  post,
}: Readonly<{
  isInteracting: boolean;
  isLiked: boolean;
  onInteraction: (interaction: 'save' | 'share', propertyId: string) => void;
  onToggleLike: () => void;
  post: FeedStreamItem;
}>): ReactElement {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(['like', 'save', 'share'] as const).map((interaction) => (
        <Button
          className={readFeedPostActionClassName(interaction, isLiked)}
          disabled={isInteracting}
          key={interaction}
          onClick={() => {
            if (interaction === 'like') {
              onToggleLike();
              return;
            }

            onInteraction(interaction, post.propertyId);
          }}
          size="sm"
          variant="outline"
        >
          {interaction === 'like' && isLiked ? 'Liked' : actionLabels[interaction]}
        </Button>
      ))}
    </div>
  );
}
