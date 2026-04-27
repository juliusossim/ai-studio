import { Injectable } from '@nestjs/common';
import type { AuthSession } from '@org/types';
import { executePrismaOperation } from '../../database/prisma-exception.mapper';
import { PrismaService } from '../../database/prisma.service';

interface SessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, refreshTokenHash: string, expiresAt: Date): Promise<AuthSession> {
    const session = await executePrismaOperation(
      () =>
        this.prisma.session.create({
          data: {
            userId,
            refreshTokenHash,
            expiresAt,
          },
        }),
      {
        dependencyDetail: 'The session store is temporarily unavailable.',
      },
    );

    return this.toAuthSession(session);
  }

  async findActiveByRefreshTokenHash(refreshTokenHash: string): Promise<AuthSession | undefined> {
    const session = await executePrismaOperation(
      () =>
        this.prisma.session.findFirst({
          where: {
            refreshTokenHash,
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
        }),
      {
        dependencyDetail: 'The session store is temporarily unavailable.',
      },
    );

    return session ? this.toAuthSession(session) : undefined;
  }

  async revoke(id: string): Promise<void> {
    await executePrismaOperation(
      () =>
        this.prisma.session.updateMany({
          where: {
            id,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        }),
      {
        dependencyDetail: 'The session store is temporarily unavailable.',
      },
    );
  }

  private toAuthSession(session: SessionRecord): AuthSession {
    return {
      id: session.id,
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt ?? undefined,
      createdAt: session.createdAt,
    };
  }
}
