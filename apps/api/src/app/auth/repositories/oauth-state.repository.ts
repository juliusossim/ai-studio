import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import type { OAuthStateRecord } from '../auth.types';
import { executePrismaOperation } from '../../database/prisma-exception.mapper';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OAuthStateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(record: OAuthStateRecord): Promise<OAuthStateRecord> {
    await this.deleteExpired();
    const created = await executePrismaOperation(
      () =>
        this.prisma.oAuthState.create({
          data: {
            state: record.state,
            codeVerifier: record.codeVerifier,
            redirectUri: record.redirectUri,
            provider: AuthProvider.google,
            expiresAt: record.expiresAt,
            createdAt: record.createdAt,
          },
        }),
      {
        dependencyDetail: 'The OAuth state store is temporarily unavailable.',
      },
    );

    return {
      state: created.state,
      codeVerifier: created.codeVerifier,
      redirectUri: created.redirectUri,
      provider: 'google',
      expiresAt: created.expiresAt,
      createdAt: created.createdAt,
    };
  }

  async consume(state: string): Promise<OAuthStateRecord | undefined> {
    await this.deleteExpired();
    const record = await executePrismaOperation(
      () =>
        this.prisma.oAuthState.findUnique({
          where: { state },
        }),
      {
        dependencyDetail: 'The OAuth state store is temporarily unavailable.',
      },
    );
    if (!record) {
      return undefined;
    }

    await executePrismaOperation(
      () =>
        this.prisma.oAuthState.delete({
          where: { state },
        }),
      {
        dependencyDetail: 'The OAuth state store is temporarily unavailable.',
      },
    );

    return {
      state: record.state,
      codeVerifier: record.codeVerifier,
      redirectUri: record.redirectUri,
      provider: 'google',
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
    };
  }

  private async deleteExpired(): Promise<void> {
    await executePrismaOperation(
      () =>
        this.prisma.oAuthState.deleteMany({
          where: {
            expiresAt: {
              lte: new Date(),
            },
          },
        }),
      {
        dependencyDetail: 'The OAuth state store is temporarily unavailable.',
      },
    );
  }
}
