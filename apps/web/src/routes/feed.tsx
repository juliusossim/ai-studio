import type { ReactElement } from 'react';
import type { Route } from './+types/feed';
import { FeedWorkspace } from '@org/ui-web';
import { parseFeedSearch } from './route-contracts';

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{
  search: ReturnType<typeof parseFeedSearch>;
}> {
  return {
    search: parseFeedSearch(request.url),
  };
}

export default function FeedRoute({ loaderData }: Route.ComponentProps): ReactElement {
  const { search } = loaderData;
  const title = search.tab === 'following' ? 'Publish to followers' : 'Publish a listing';

  return (
    <section className="space-y-6">
      <header className="rounded-[1.5rem] border border-border/60 bg-card px-5 py-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Feed route contract
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Signed-in discovery workspace
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          URL state is validated before render so feed mode stays shareable and durable.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-3 py-1">tab={search.tab}</span>
          <span className="rounded-full border px-3 py-1">content={search.content}</span>
          <span className="rounded-full border px-3 py-1">sort={search.sort}</span>
          {search.cursor ? (
            <span className="rounded-full border px-3 py-1">cursor=present</span>
          ) : null}
        </div>
      </header>
      <FeedWorkspace title={title} />
    </section>
  );
}
