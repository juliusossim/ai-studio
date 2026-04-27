import { Injectable } from '@nestjs/common';
import type { EventType, Property, PropertyInteractionResponse } from '@org/types';
import type { CreateEventDto } from '../events/dto/create-event.dto';
import { EventsService } from '../events/events.service';
import type { CreatePropertyDto } from './dto/create-property.dto';
import type { PropertyInteractionDto } from './dto/property-interaction.dto';
import { PropertyRepository } from './property.repository';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly eventsService: EventsService,
  ) {}

  create(input: CreatePropertyDto, ownerUserId: string): Promise<Property> {
    return this.propertyRepository.create(input, ownerUserId);
  }

  findMany(): Promise<Property[]> {
    return this.propertyRepository.findMany();
  }

  findActive(): Promise<Property[]> {
    return this.propertyRepository.findActive();
  }

  findById(id: string): Promise<Property> {
    return this.propertyRepository.findById(id);
  }

  async trackInteraction(
    propertyId: string,
    input: PropertyInteractionDto,
    type: Extract<
      EventType,
      'like_property' | 'save_property' | 'share_property' | 'view_property'
    >,
  ): Promise<PropertyInteractionResponse> {
    const property = await this.findById(propertyId);
    const eventInput: CreateEventDto = {
      sessionId: input.sessionId,
      userId: input.userId,
      type,
      entityId: property.id,
      entityType: 'property',
      metadata: {},
    };

    return {
      property,
      event: await this.eventsService.track(eventInput),
    };
  }
}
