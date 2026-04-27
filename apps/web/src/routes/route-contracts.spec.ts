import {
  buildDiscoveryPath,
  buildFeedPath,
  buildListingDetailPath,
  buildRegisterPath,
  buildSignInPath,
  parseDiscoverySearch,
  parseListingDetailParams,
  parseListingDetailSearch,
  parseRouteRedirectSearch,
} from './route-contracts';

describe('route-contracts', () => {
  it('normalizes invalid redirect targets to the feed route', () => {
    expect(
      parseRouteRedirectSearch('https://ripples.test/sign-in?redirectTo=https://evil.com'),
    ).toEqual({
      redirectTo: '/feed',
    });
  });

  it('drops inverted discovery price ranges', () => {
    expect(
      parseDiscoverySearch('https://ripples.test/?content=listings&priceMin=900&priceMax=100'),
    ).toEqual({
      content: 'listings',
      sort: 'for-you',
      cursor: undefined,
      city: undefined,
      listingType: undefined,
      priceMin: undefined,
      priceMax: undefined,
    });
  });

  it('builds canonical paths without default search values', () => {
    expect(buildDiscoveryPath()).toBe('/');
    expect(buildFeedPath()).toBe('/feed');
    expect(buildSignInPath()).toBe('/sign-in');
    expect(buildRegisterPath()).toBe('/register');
    expect(buildListingDetailPath({ listingId: 'listing-123' })).toBe('/listings/listing-123');
  });

  it('builds listing detail paths with non-default search values only', () => {
    expect(
      buildListingDetailPath({
        listingId: 'listing-123',
        search: { from: 'feed', media: 2, intent: 'book-viewing' },
      }),
    ).toBe('/listings/listing-123?from=feed&media=2&intent=book-viewing');
  });

  it('parses listing detail params and search with defaults', () => {
    expect(parseListingDetailParams({ listingId: 'listing-123' })).toEqual({
      listingId: 'listing-123',
    });
    expect(
      parseListingDetailSearch('https://ripples.test/listings/listing-123?intent=share'),
    ).toEqual({
      from: undefined,
      media: 0,
      intent: 'share',
    });
  });
});
