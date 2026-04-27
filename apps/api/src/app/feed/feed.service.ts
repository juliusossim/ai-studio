import { Injectable } from '@nestjs/common';
import type {
  Content,
  FeedAuthorSummary,
  FeedItemResponse,
  FeedPrimaryReason,
  FeedRankingLabel,
  FeedReasonBadge,
  FeedResponse,
  FeedScoreBreakdown,
  FeedSocialMetadata,
  Property,
} from '@org/types';
import { readNonEmptyString, readRecord } from '@org/utils';
import { EventsService } from '../events/events.service';
import { PropertyService } from '../property/property.service';
import { FeedRankingService } from './ranking/feed-ranking.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly eventsService: EventsService,
    private readonly feedRankingService: FeedRankingService,
  ) {}

  async getFeed(limit = 20, cursor = 0): Promise<FeedResponse> {
    const pageSize = limit;
    const offset = cursor;
    const properties = await this.propertyService.findActive();
    const propertyItems = await Promise.all(
      properties.map((property) => this.toPropertyFeedItem(property)),
    );
    const items = this.buildMixedFeedItems(propertyItems).sort(
      (left, right) =>
        right.score - left.score ||
        right.content.createdAt.getTime() - left.content.createdAt.getTime(),
    );
    const page = items.slice(offset, offset + pageSize);
    const nextOffset = offset + page.length;

    return {
      items: page,
      nextCursor: nextOffset < items.length ? String(nextOffset) : undefined,
    };
  }

  private async toPropertyFeedItem(property: Property): Promise<FeedItemResponse> {
    const [likes, saves, shares, views] = await Promise.all([
      this.eventsService.countForEntity(property.id, 'like_property'),
      this.eventsService.countForEntity(property.id, 'save_property'),
      this.eventsService.countForEntity(property.id, 'share_property'),
      this.eventsService.countForEntity(property.id, 'view_property'),
    ]);
    const content: Content = {
      id: `property:${property.id}`,
      type: 'property',
      createdBy: 'system',
      media: property.media,
      metadata: {
        propertyId: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price,
        status: property.status,
        views,
      },
      engagement: {
        likes,
        saves,
        shares,
      },
      createdAt: property.createdAt,
    };
    const scoreBreakdown = this.feedRankingService.scoreProperty(property, {
      likes,
      saves,
      shares,
      views,
    });
    const social = this.readSocialMetadata(content, views, scoreBreakdown);

    return {
      id: content.id,
      type: 'property',
      content,
      score: this.feedRankingService.totalScore(scoreBreakdown),
      scoreBreakdown,
      social,
    };
  }

  private buildMixedFeedItems(propertyItems: FeedItemResponse[]): FeedItemResponse[] {
    if (propertyItems.length === 0) {
      return [];
    }

    const newestProperty = [...propertyItems].sort(
      (left, right) => right.content.createdAt.getTime() - left.content.createdAt.getTime(),
    )[0];
    const strongestProperty = [...propertyItems].sort((left, right) => right.score - left.score)[0];
    const items = [...propertyItems];

    if (newestProperty) {
      items.push(this.toLiveEventItem(newestProperty));
    }

    if (strongestProperty) {
      items.push(this.toTrendingItem(strongestProperty));
    }

    return items;
  }

  private toLiveEventItem(item: FeedItemResponse): FeedItemResponse {
    const metadata = item.content.metadata;
    const title = readNonEmptyString(metadata.title, 'Untitled listing');
    const location = this.readLocationLabel(metadata);
    const content: Content = {
      id: `live-event:${this.readPropertyId(metadata, item.id)}`,
      type: 'live-event',
      createdBy: 'system',
      media: item.content.media,
      metadata: {
        propertyId: this.readPropertyId(metadata, item.id),
        eventTitle: `${title} live walkthrough`,
        eventStatus: 'Happening now',
        summary: `Join a live walkthrough from ${location} and get the fastest answers on price, layout, and viewing intent.`,
        location: metadata.location,
        price: metadata.price,
      },
      engagement: item.content.engagement,
      createdAt: new Date(item.content.createdAt.getTime() + 30 * 60 * 1000),
    };
    const scoreBreakdown: FeedScoreBreakdown = {
      recency: this.bumpScore(item.scoreBreakdown.recency, 6),
      engagement: this.bumpScore(item.scoreBreakdown.engagement, 4),
      ripple: this.bumpScore(item.scoreBreakdown.ripple, 2),
    };

    return {
      id: content.id,
      type: 'live-event',
      content,
      score: this.feedRankingService.totalScore(scoreBreakdown),
      scoreBreakdown,
      social: this.readSocialMetadata(content, item.social.views, scoreBreakdown, {
        authorName: 'Ripples Live',
        authorRole: 'Live host',
        primaryReason: 'fresh_to_feed',
        recommendationSummary: `Fresh to the feed because the live room around ${title} is happening now and gives buyers a faster way to qualify the opportunity.`,
      }),
    };
  }

  private toTrendingItem(item: FeedItemResponse): FeedItemResponse {
    const metadata = item.content.metadata;
    const title = readNonEmptyString(metadata.title, 'Untitled listing');
    const location = this.readLocationLabel(metadata);
    const content: Content = {
      id: `news:${this.readPropertyId(metadata, item.id)}`,
      type: 'news',
      createdBy: 'system',
      media: item.content.media,
      metadata: {
        propertyId: this.readPropertyId(metadata, item.id),
        headline: `${location} demand is climbing around ${title}`,
        trendStatus: 'Trending now',
        summary: `Buyer attention is clustering around ${title}, making it a useful signal for what is moving fastest in ${location}.`,
        location: metadata.location,
      },
      engagement: item.content.engagement,
      createdAt: new Date(item.content.createdAt.getTime() + 15 * 60 * 1000),
    };
    const scoreBreakdown: FeedScoreBreakdown = {
      recency: this.bumpScore(item.scoreBreakdown.recency, 2),
      engagement: this.bumpScore(item.scoreBreakdown.engagement, 8),
      ripple: this.bumpScore(item.scoreBreakdown.ripple, 6),
    };

    return {
      id: content.id,
      type: 'news',
      content,
      score: this.feedRankingService.totalScore(scoreBreakdown),
      scoreBreakdown,
      social: this.readSocialMetadata(content, item.social.views, scoreBreakdown, {
        authorName: 'Ripples Trends',
        authorRole: 'Market pulse',
        primaryReason: 'trending_with_buyers',
        recommendationSummary: `Trending with buyers because ${title} is attracting strong interaction and signaling where demand is concentrating in ${location}.`,
      }),
    };
  }

  private readAuthor(content: Content, scoreBreakdown: FeedScoreBreakdown): FeedAuthorSummary {
    return {
      id: content.createdBy,
      name: content.createdBy === 'system' ? 'Ripples Feed' : this.toDisplayName(content.createdBy),
      role: this.readAuthorRole(scoreBreakdown),
      source: content.createdBy === 'system' ? 'system' : 'user',
      verified: content.createdBy === 'system',
    };
  }

  private readAuthorRole(scoreBreakdown: FeedScoreBreakdown): string {
    if (scoreBreakdown.engagement >= 30) {
      return 'Community momentum';
    }

    if (scoreBreakdown.recency >= 50) {
      return 'New listing pick';
    }

    return 'AI-ranked listing';
  }

  private readEngagementReason(engagement: number): string {
    if (engagement >= 40) {
      return 'strong social traction';
    }

    if (engagement >= 15) {
      return 'steady interaction signals';
    }

    return 'early-stage traction';
  }

  private readPrimaryReason(scoreBreakdown: FeedScoreBreakdown): FeedPrimaryReason {
    if (scoreBreakdown.engagement >= 30) {
      return 'trending_with_buyers';
    }

    if (scoreBreakdown.recency >= 50) {
      return 'fresh_to_feed';
    }

    if (scoreBreakdown.ripple >= 20) {
      return 'strong_ripple_score';
    }

    return 'ranked_for_you';
  }

  private readPrimaryReasonLabel(primaryReason: FeedPrimaryReason): string {
    if (primaryReason === 'trending_with_buyers') {
      return 'Trending with buyers';
    }

    if (primaryReason === 'fresh_to_feed') {
      return 'Fresh to the feed';
    }

    if (primaryReason === 'strong_ripple_score') {
      return 'Strong ripple score';
    }

    return 'Ranked for you';
  }

  private readRankingLabel(score: number): FeedRankingLabel {
    if (score >= 90) {
      return 'top_match';
    }

    if (score >= 70) {
      return 'momentum';
    }

    return 'fresh_pick';
  }

  private readReasonBadges(scoreBreakdown: FeedScoreBreakdown, views: number): FeedReasonBadge[] {
    const badges: FeedReasonBadge[] = [];

    if (scoreBreakdown.engagement >= 20) {
      badges.push('rising_saves');
    }

    if (scoreBreakdown.recency >= 50) {
      badges.push('just_listed');
    }

    if (views >= 25) {
      badges.push('watched_often');
    }

    if (badges.length === 0) {
      badges.push('low_friction_discovery');
    }

    return badges;
  }

  private readRecencyReason(recency: number): string {
    if (recency >= 60) {
      return 'very fresh';
    }

    if (recency >= 30) {
      return 'recent';
    }

    return 'still relevant';
  }

  private readSocialMetadata(
    content: Content,
    views: number,
    scoreBreakdown: FeedScoreBreakdown,
    overrides: {
      readonly authorName?: string;
      readonly authorRole?: string;
      readonly primaryReason?: FeedPrimaryReason;
      readonly recommendationSummary?: string;
    } = {},
  ): FeedSocialMetadata {
    const primaryReason = overrides.primaryReason ?? this.readPrimaryReason(scoreBreakdown);
    const totalScore = this.feedRankingService.totalScore(scoreBreakdown);

    return {
      author: {
        ...this.readAuthor(content, scoreBreakdown),
        ...(overrides.authorName ? { name: overrides.authorName } : {}),
        ...(overrides.authorRole ? { role: overrides.authorRole } : {}),
      },
      views,
      rankingLabel: this.readRankingLabel(totalScore),
      primaryReason,
      reasonBadges: this.readReasonBadges(scoreBreakdown, views),
      recommendationSummary:
        overrides.recommendationSummary ??
        `${this.readPrimaryReasonLabel(primaryReason)} because it is ${this.readRecencyReason(
          scoreBreakdown.recency,
        )}, carries ${this.readEngagementReason(scoreBreakdown.engagement)}, and has a ripple score of ${Math.round(
          scoreBreakdown.ripple,
        )}.`,
    };
  }

  private toDisplayName(value: string): string {
    return value
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(' ');
  }

  private bumpScore(score: number, delta: number): number {
    return Number((score + delta).toFixed(2));
  }

  private readLocationLabel(metadata: Record<string, unknown>): string {
    const location = readRecord(metadata.location);
    const city = readNonEmptyString(location.city, 'Unknown city');
    const country = readNonEmptyString(location.country, 'Unknown country');

    return `${city}, ${country}`;
  }

  private readPropertyId(metadata: Record<string, unknown>, fallback: string): string {
    return readNonEmptyString(
      metadata.propertyId,
      fallback.replace(/^(property|live-event|news):/, ''),
    );
  }
}
