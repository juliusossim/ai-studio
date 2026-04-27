import { formatCurrency, readFiniteNumber, readNonEmptyString, readRecord } from '@org/utils';
import type { FeedItemResponse } from '@org/types';
import type { PropertyCardMetadata } from './property-card.types';

export function readPropertyCardMetadata(item: FeedItemResponse): PropertyCardMetadata {
  const metadata = item.content.metadata;
  const location = readRecord(metadata.location);
  const price = readRecord(metadata.price);
  const city = readNonEmptyString(location.city, 'Unknown city');
  const country = readNonEmptyString(location.country, 'Unknown country');
  const amount = readFiniteNumber(price.amount, 0);
  const currency = readNonEmptyString(price.currency, 'USD');

  return {
    propertyId: readNonEmptyString(metadata.propertyId, item.id.replace('property:', '')),
    title: readNonEmptyString(metadata.title, 'Untitled listing'),
    description: readNonEmptyString(metadata.description, ''),
    locationLabel: `${city}, ${country}`,
    priceLabel: formatCurrency(amount, currency),
    status: readNonEmptyString(metadata.status, 'active'),
    views: item.social.views,
  };
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
