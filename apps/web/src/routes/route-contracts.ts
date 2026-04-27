import { href } from 'react-router';
import { z } from 'zod';

const internalPathPattern = /^\/(?!\/)/;

const discoveryContentSchema = z.enum(['all', 'listings', 'campaigns', 'posts', 'live']);
const discoverySortSchema = z.enum(['for-you', 'newest', 'popular', 'most-saved']);
const listingTypeSchema = z.enum(['buy', 'rent', 'shortlet', 'land']);
const feedTabSchema = z.enum(['for-you', 'following', 'saved-signals']);
const listingSourceSchema = z.enum(['feed', 'saved', 'creator', 'live', 'notification']);
const listingIntentSchema = z.enum(['view', 'inquire', 'book-viewing', 'share']);

const optionalNonNegativeIntegerSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Number(value);
}, z.number().int().nonnegative().optional());

const listingMediaIndexSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  return Number(value);
}, z.number().int().nonnegative().catch(0));

const routeRedirectSchema = z.object({
  redirectTo: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value || !internalPathPattern.test(value)) {
        return '/feed';
      }

      return value;
    }),
});

const discoverySearchBaseSchema = z.object({
  content: discoveryContentSchema.catch('all'),
  sort: discoverySortSchema.catch('for-you'),
  cursor: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  listingType: listingTypeSchema.optional().catch(undefined),
  priceMin: optionalNonNegativeIntegerSchema.catch(undefined),
  priceMax: optionalNonNegativeIntegerSchema.catch(undefined),
});

const feedSearchBaseSchema = z.object({
  tab: feedTabSchema.catch('for-you'),
  content: discoveryContentSchema.catch('all'),
  sort: discoverySortSchema.catch('for-you'),
  cursor: z.string().trim().min(1).optional(),
});

const listingDetailParamSchema = z.object({
  listingId: z.string().trim().min(1),
});

const listingDetailSearchBaseSchema = z.object({
  from: listingSourceSchema.optional().catch(undefined),
  media: listingMediaIndexSchema,
  intent: listingIntentSchema.catch('view'),
});

export const routeRedirectSearchSchema = routeRedirectSchema;

export const discoverySearchSchema = discoverySearchBaseSchema.transform((input) => {
  if (
    input.priceMin !== undefined &&
    input.priceMax !== undefined &&
    input.priceMin > input.priceMax
  ) {
    return {
      ...input,
      priceMin: undefined,
      priceMax: undefined,
    };
  }

  return input;
});

export const feedSearchSchema = feedSearchBaseSchema;
export const listingDetailParamSchemaValidated = listingDetailParamSchema;
export const listingDetailSearchSchema = listingDetailSearchBaseSchema;

export type RouteRedirectSearch = z.output<typeof routeRedirectSearchSchema>;
export type DiscoverySearch = z.output<typeof discoverySearchSchema>;
export type FeedSearch = z.output<typeof feedSearchSchema>;
export type ListingDetailParams = z.output<typeof listingDetailParamSchemaValidated>;
export type ListingDetailSearch = z.output<typeof listingDetailSearchSchema>;

export interface SignInPathInput {
  readonly redirectTo?: string;
}

export interface RegisterPathInput {
  readonly redirectTo?: string;
}

export interface ListingDetailPathInput {
  readonly listingId: string;
  readonly search?: Partial<ListingDetailSearch>;
}

export interface ListingFlowPathInput {
  readonly listingId: string;
}

export function parseRouteRedirectSearch(requestUrl: string): RouteRedirectSearch {
  return parseRouteSearch(requestUrl, routeRedirectSearchSchema);
}

export function parseDiscoverySearch(requestUrl: string): DiscoverySearch {
  return parseRouteSearch(requestUrl, discoverySearchSchema);
}

export function parseFeedSearch(requestUrl: string): FeedSearch {
  return parseRouteSearch(requestUrl, feedSearchSchema);
}

export function parseListingDetailParams(params: unknown): ListingDetailParams {
  return listingDetailParamSchemaValidated.parse(params);
}

export function parseListingDetailSearch(requestUrl: string): ListingDetailSearch {
  return parseRouteSearch(requestUrl, listingDetailSearchSchema);
}

export function buildSignInPath(input: SignInPathInput = {}): string {
  return appendSearchToPath(href('/sign-in'), {
    redirectTo: normalizeRedirectTo(input.redirectTo),
  });
}

export function buildRegisterPath(input: RegisterPathInput = {}): string {
  return appendSearchToPath(href('/register'), {
    redirectTo: normalizeRedirectTo(input.redirectTo),
  });
}

export function buildDiscoveryPath(search: Partial<DiscoverySearch> = {}): string {
  const normalized = discoverySearchSchema.parse(search);

  return appendSearchToPath(href('/'), {
    content: normalized.content === 'all' ? undefined : normalized.content,
    sort: normalized.sort === 'for-you' ? undefined : normalized.sort,
    cursor: normalized.cursor,
    city: normalized.city,
    listingType: normalized.listingType,
    priceMin: normalized.priceMin,
    priceMax: normalized.priceMax,
  });
}

export function buildFeedPath(search: Partial<FeedSearch> = {}): string {
  const normalized = feedSearchSchema.parse(search);

  return appendSearchToPath(href('/feed'), {
    tab: normalized.tab === 'for-you' ? undefined : normalized.tab,
    content: normalized.content === 'all' ? undefined : normalized.content,
    sort: normalized.sort === 'for-you' ? undefined : normalized.sort,
    cursor: normalized.cursor,
  });
}

export function buildListingDetailPath({
  listingId,
  search = {},
}: Readonly<ListingDetailPathInput>): string {
  const normalizedParams = parseListingDetailParams({ listingId });
  const normalizedSearch = listingDetailSearchSchema.parse(search);

  return appendSearchToPath(href('/listings/:listingId', normalizedParams), {
    from: normalizedSearch.from,
    media: normalizedSearch.media === 0 ? undefined : normalizedSearch.media,
    intent: normalizedSearch.intent === 'view' ? undefined : normalizedSearch.intent,
  });
}

export function buildListingInquirePath({ listingId }: Readonly<ListingFlowPathInput>): string {
  return href('/listings/:listingId/inquire', parseListingDetailParams({ listingId }));
}

export function buildListingRequestViewingPath({
  listingId,
}: Readonly<ListingFlowPathInput>): string {
  return href('/listings/:listingId/request-viewing', parseListingDetailParams({ listingId }));
}

export function composeRedirectTo(pathname: string, search: string): string {
  return `${pathname}${search}`;
}

function parseRouteSearch<TSchema extends z.ZodType>(
  requestUrl: string,
  schema: TSchema,
): z.output<TSchema> {
  const searchParams = new URL(requestUrl).searchParams;

  return schema.parse(flattenSearchParams(searchParams));
}

function flattenSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const flattened = new Map<string, string>();

  searchParams.forEach((value, key) => {
    if (!flattened.has(key)) {
      flattened.set(key, value);
    }
  });

  return Object.fromEntries(flattened);
}

function appendSearchToPath(
  pathname: string,
  search: Readonly<Record<string, string | number | undefined>>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function normalizeRedirectTo(redirectTo?: string): string | undefined {
  const normalized = routeRedirectSearchSchema.parse({ redirectTo }).redirectTo;

  return normalized === '/feed' ? undefined : normalized;
}
