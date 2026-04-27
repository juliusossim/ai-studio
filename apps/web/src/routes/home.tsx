import type { ReactElement } from 'react';
import type { Route } from './+types/home';
import { buildFeedPath, buildSignInPath, parseDiscoverySearch } from './route-contracts';
import { RoutePlaceholder } from './route-placeholder';

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{
  search: ReturnType<typeof parseDiscoverySearch>;
}> {
  return {
    search: parseDiscoverySearch(request.url),
  };
}

export default function HomeRoute({ loaderData }: Route.ComponentProps): ReactElement {
  const { search } = loaderData;
  const filterSummary = [
    `content=${search.content}`,
    `sort=${search.sort}`,
    search.city ? `city=${search.city}` : undefined,
    search.listingType ? `listingType=${search.listingType}` : undefined,
    search.priceMin !== undefined ? `priceMin=${search.priceMin}` : undefined,
    search.priceMax !== undefined ? `priceMax=${search.priceMax}` : undefined,
    search.cursor ? 'cursor=present' : undefined,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <RoutePlaceholder
      actions={[
        {
          href: buildFeedPath({
            content: search.content,
            sort: search.sort,
            cursor: search.cursor,
          }),
          label: 'Open signed-in feed',
        },
        {
          href: buildSignInPath({
            redirectTo: buildFeedPath({
              content: search.content,
              sort: search.sort,
              cursor: search.cursor,
            }),
          }),
          label: 'Sign in',
        },
      ]}
      description={`This route now validates the public discovery URL contract before render. Current state: ${filterSummary}. The next migration step is to replace this placeholder with the real visitor-safe discovery feed while keeping this URL schema stable.`}
      eyebrow="Discovery"
      title="Ripples public feed route"
    />
  );
}
