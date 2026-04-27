import {
  useCreatePropertyMutation,
  useFeedQuery,
  usePropertyInteractionMutation,
  useRipplesClientStore,
  type PropertyInteractionName,
} from '@org/data';
import type { CreatePropertyRequest } from '@org/types';
import { useState, type ReactElement } from 'react';
import { useSession } from '../session/provider/session-provider';
import { FeedCreatePanel } from './feed-create/feed-create-panel';
import { useTrackFeedViews } from './feed-hooks/use-track-feed-views';
import { FeedHero } from './feed-stream/feed-hero';
import { FeedPostCard } from './feed-stream/feed-post-card';
import { FeedSidebar } from './feed-stream/feed-sidebar';
import { FeedSkeletonCard } from './feed-stream/feed-skeleton-card';
import { FilterBar } from './feed-stream/filter-bar';
import { readWorkspaceError, sortFeedItems } from './feed-utils/feed.utils';
import {
  publishFeedProperty,
  trackFeedPropertyInteraction,
} from './feed-utils/feed-workspace.utils';
import type { FeedView, FeedWorkspaceProps } from './feed.types';
import { FeedState } from './feed-status/feed-status';

export function FeedWorkspace({
  title = 'Feed workspace',
}: Readonly<FeedWorkspaceProps>): ReactElement {
  const { accessToken, user } = useSession();
  const sessionId = useRipplesClientStore((state) => state.sessionId);
  const feed = useFeedQuery({ accessToken, limit: 20 });
  const createProperty = useCreatePropertyMutation(accessToken);
  const interaction = usePropertyInteractionMutation(accessToken);
  const { isPending: isInteracting, mutate: trackPropertyInteraction } = interaction;
  const [activeView, setActiveView] = useState<FeedView>('For you');
  const [propertyErrorMessage, setPropertyErrorMessage] = useState<string | null>(null);

  useTrackFeedViews({
    items: feed.data?.items,
    sessionId,
    trackInteraction: trackPropertyInteraction,
    userId: user?.id,
  });

  const items = sortFeedItems(feed.data?.items ?? [], activeView);

  return (
    <section className="space-y-8">
      <FeedHero />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <FilterBar activeView={activeView} onChange={setActiveView} />
          <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,#08172b_0%,#0c213d_100%)] px-5 py-4 text-white shadow-[0_16px_54px_rgba(4,11,24,0.16)]">
            <p className="text-sm text-white/62">Ranked by recency, engagement, and ripple score</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Discovery feed</h2>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/78">
                {feed.isLoading
                  ? 'Syncing feed'
                  : `${items.length} post${items.length === 1 ? '' : 's'}`}
              </span>
            </div>
          </div>
          {feed.isError ? (
            <FeedState message={readWorkspaceError(feed.error)} title="Feed unavailable" />
          ) : null}
          {feed.isLoading ? (
            <div className="space-y-6">
              <FeedSkeletonCard />
              <FeedSkeletonCard />
              <FeedSkeletonCard />
            </div>
          ) : null}
          {!feed.isLoading && feed.data?.items.length === 0 ? (
            <FeedState
              message="Publish the first listing to start the discovery loop and give the feed something to rank."
              title="No listings yet"
            />
          ) : null}
          {!feed.isLoading && items.length > 0 ? (
            <div className="space-y-6">
              {items.map((item) => (
                <FeedPostCard
                  isInteracting={isInteracting}
                  item={item}
                  key={item.id}
                  onInteraction={(interactionName: PropertyInteractionName, propertyId: string) =>
                    trackFeedPropertyInteraction({
                      interaction: interactionName,
                      mutate: trackPropertyInteraction,
                      propertyId,
                      sessionId,
                      userId: user?.id,
                    })
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-6">
          <FeedCreatePanel
            accessToken={accessToken}
            isCreatingProperty={createProperty.isPending}
            onPropertySubmit={(input: CreatePropertyRequest) =>
              publishFeedProperty({
                createProperty,
                createPropertyInput: input,
                onError: setPropertyErrorMessage,
                readErrorMessage: readWorkspaceError,
                resetError: () => setPropertyErrorMessage(null),
              })
            }
            propertyError={propertyErrorMessage ?? undefined}
            title={title}
          />
          <FeedSidebar activeView={activeView} count={items.length} />
        </div>
      </div>
    </section>
  );
}
