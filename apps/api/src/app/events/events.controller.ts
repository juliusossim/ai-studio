import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { Event as RipplesEvent } from '@org/types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  track(
    @Body() input: CreateEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RipplesEvent> {
    return this.eventsService.track({
      ...input,
      userId: user.id,
    });
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  findMany(): Promise<RipplesEvent[]> {
    return this.eventsService.findMany();
  }
}
