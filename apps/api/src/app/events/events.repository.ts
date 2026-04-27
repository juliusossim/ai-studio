import { Injectable } from '@nestjs/common';
import { EventType as PrismaEventType, Prisma, type BehaviorEvent } from '@prisma/client';
import type { Event as RipplesEvent, EventType } from '@org/types';
import { executePrismaOperation } from '../database/prisma-exception.mapper';
import { PrismaService } from '../database/prisma.service';
import type { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateEventDto): Promise<RipplesEvent> {
    const event = await executePrismaOperation(
      () =>
        this.prisma.behaviorEvent.create({
          data: {
            userId: input.userId,
            sessionId: input.sessionId,
            type: input.type as PrismaEventType,
            entityId: input.entityId,
            entityType: input.entityType,
            metadata: this.toInputJson(input.metadata ?? {}),
          },
        }),
      {
        dependencyDetail: 'The event store is temporarily unavailable.',
      },
    );

    return this.toEvent(event);
  }

  async findMany(): Promise<RipplesEvent[]> {
    const events = await executePrismaOperation(
      () =>
        this.prisma.behaviorEvent.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        }),
      {
        dependencyDetail: 'The event store is temporarily unavailable.',
      },
    );

    return events.map((event) => this.toEvent(event));
  }

  async findForEntity(entityId: string): Promise<RipplesEvent[]> {
    const events = await executePrismaOperation(
      () =>
        this.prisma.behaviorEvent.findMany({
          where: { entityId },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      {
        dependencyDetail: 'The event store is temporarily unavailable.',
      },
    );

    return events.map((event) => this.toEvent(event));
  }

  async countForEntity(entityId: string, type: EventType): Promise<number> {
    return executePrismaOperation(
      () =>
        this.prisma.behaviorEvent.count({
          where: {
            entityId,
            type: type as PrismaEventType,
          },
        }),
      {
        dependencyDetail: 'The event store is temporarily unavailable.',
      },
    );
  }

  private toEvent(event: BehaviorEvent): RipplesEvent {
    return {
      id: event.id,
      userId: event.userId ?? undefined,
      sessionId: event.sessionId ?? '',
      type: event.type,
      entityId: event.entityId,
      entityType: event.entityType,
      metadata: this.toMetadata(event.metadata),
      createdAt: event.createdAt,
    };
  }

  private toInputJson(value: Record<string, unknown>): Prisma.InputJsonObject {
    return value as Prisma.InputJsonObject;
  }

  private toMetadata(value: Prisma.JsonValue): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}
