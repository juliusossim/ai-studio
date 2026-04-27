import { Controller, Get, Query } from '@nestjs/common';
import type { FeedResponse } from '@org/types';
import { FeedQueryDto } from './dto/feed-query.dto';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Query() query: FeedQueryDto): Promise<FeedResponse> {
    return this.feedService.getFeed(query.limit, query.cursor);
  }
}
