import type { ReactElement } from 'react';
import type { Route } from './+types/listing-detail';
import {
  buildFeedPath,
  buildListingInquirePath,
  buildListingRequestViewingPath,
  parseListingDetailParams,
  parseListingDetailSearch,
} from './route-contracts';
import { RoutePlaceholder } from './route-placeholder';

export async function clientLoader({ params, request }: Route.ClientLoaderArgs): Promise<{
  params: ReturnType<typeof parseListingDetailParams>;
  search: ReturnType<typeof parseListingDetailSearch>;
}> {
  return {
    params: parseListingDetailParams(params),
    search: parseListingDetailSearch(request.url),
  };
}

export default function ListingDetailRoute({ loaderData }: Route.ComponentProps): ReactElement {
  const { params, search } = loaderData;

  return (
    <RoutePlaceholder
      actions={[
        { href: buildListingInquirePath({ listingId: params.listingId }), label: 'Start inquiry' },
        {
          href: buildListingRequestViewingPath({ listingId: params.listingId }),
          label: 'Request viewing',
        },
        { href: buildFeedPath(), label: 'Return to feed' },
      ]}
      description={`Listing ${params.listingId} is now resolved through a validated public detail route. Current state: intent=${search.intent}, media=${search.media}${search.from ? `, from=${search.from}` : ''}. The next implementation step is to render the full property detail surface with trust signals, media state, and conversion calls to action.`}
      eyebrow="Listings"
      title="Listing detail route"
    />
  );
}
