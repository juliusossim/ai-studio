import type { RipplesApiClient } from '@org/api-client';
import type { AuthResponse, FeedResponse, Property } from '@org/types';

export const testAuthResponse: AuthResponse = {
  user: {
    id: 'user_1',
    email: 'ada@example.com',
    fullName: 'Ada Lovelace',
    roles: ['user'],
    providers: ['manual'],
    emailVerified: true,
    createdAt: new Date('2026-04-15T00:00:00.000Z'),
    updatedAt: new Date('2026-04-15T00:00:00.000Z'),
  },
  tokens: {
    accessToken: 'access-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
  },
};

export function createAuthClientStub(overrides: Partial<RipplesApiClient> = {}): RipplesApiClient {
  return {
    completeGoogleOAuth: async () => testAuthResponse,
    createProperty: async () => testProperty,
    abortMediaUpload: async () => ({ success: true }),
    completeMediaUpload: async () => ({
      id: 'media_asset_complete',
      mimeType: 'image/jpeg',
      originalName: 'listing.jpg',
      source: 'device',
      status: 'ready',
      type: 'image',
      url: 'https://example.com/uploads/listing.jpg',
    }),
    getFeed: async () => testFeedResponse,
    getMe: async () => testAuthResponse.user,
    getProperties: async () => [testProperty],
    initiateMediaUpload: async () => ({
      mediaAssetId: 'media_asset_initiated',
      upload: {
        expiresAt: new Date('2026-04-15T00:10:00.000Z'),
        headers: {
          'content-type': 'image/jpeg',
        },
        method: 'PUT',
        url: 'https://storage.example.com/upload',
      },
    }),
    likeProperty: async () => ({ property: testProperty, event: testEvent('like_property') }),
    loginManual: async () => testAuthResponse,
    logout: async () => ({ success: true }),
    refresh: async () => testAuthResponse,
    registerManual: async () => testAuthResponse,
    saveProperty: async () => ({ property: testProperty, event: testEvent('save_property') }),
    shareProperty: async () => ({ property: testProperty, event: testEvent('share_property') }),
    startGoogleOAuth: async () => ({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      state: 'oauth-state',
      expiresAt: new Date('2026-04-15T00:10:00.000Z'),
    }),
    uploadMedia: async (files) =>
      files.map((file) => ({
        id: `media_asset_${file.name}`,
        mimeType: file.type,
        originalName: file.name,
        source: 'device' as const,
        status: 'ready' as const,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: `https://example.com/uploads/${file.name}`,
      })),
    viewProperty: async () => ({ property: testProperty, event: testEvent('view_property') }),
    ...overrides,
  };
}

export const testProperty: Property = {
  id: 'property_1',
  title: 'Waterfront apartment',
  description: 'A bright waterfront apartment with strong buyer intent.',
  location: {
    city: 'Accra',
    country: 'Ghana',
  },
  price: {
    amount: 250000,
    currency: 'USD',
  },
  media: [
    {
      id: 'media_1',
      url: 'https://example.com/property.jpg',
      type: 'image',
      alt: 'Waterfront apartment exterior',
    },
  ],
  status: 'active',
  createdAt: new Date('2026-04-15T00:00:00.000Z'),
  updatedAt: new Date('2026-04-15T00:00:00.000Z'),
};

export const testFeedResponse: FeedResponse = {
  items: [
    {
      id: 'property:property_1',
      type: 'property',
      content: {
        id: 'property:property_1',
        type: 'property',
        createdBy: 'system',
        media: testProperty.media,
        metadata: {
          propertyId: testProperty.id,
          title: testProperty.title,
          description: testProperty.description,
          location: testProperty.location,
          price: testProperty.price,
          status: testProperty.status,
          views: 0,
        },
        engagement: {
          likes: 0,
          saves: 0,
          shares: 0,
        },
        createdAt: testProperty.createdAt,
      },
      score: 99,
      scoreBreakdown: {
        recency: 99,
        engagement: 0,
        ripple: 0,
      },
      social: {
        author: {
          id: 'system',
          name: 'Ripples Feed',
          role: 'New listing pick',
          source: 'system',
          verified: true,
        },
        views: 0,
        rankingLabel: 'top_match',
        primaryReason: 'fresh_to_feed',
        reasonBadges: ['just_listed'],
        recommendationSummary:
          'Fresh to the feed because it is very fresh, carries early-stage traction, and has a ripple score of 0.',
      },
    },
  ],
};

function testEvent(type: 'like_property' | 'save_property' | 'share_property' | 'view_property') {
  return {
    id: `${type}_1`,
    sessionId: 'session_1',
    type,
    entityId: testProperty.id,
    entityType: 'property',
    metadata: {},
    createdAt: new Date('2026-04-15T00:00:00.000Z'),
  };
}
