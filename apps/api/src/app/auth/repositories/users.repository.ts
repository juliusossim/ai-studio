import { Injectable } from '@nestjs/common';
import { AuthProvider, Prisma, UserSystemRole } from '@prisma/client';
import type {
  AuthProvider as PublicAuthProvider,
  AuthUser,
  UserRole as PublicUserRole,
} from '@org/types';
import type { CreateManualUserInput, StoredUser, UpsertGoogleUserInput } from '../auth.types';
import { executePrismaOperation } from '../../database/prisma-exception.mapper';
import { PrismaService } from '../../database/prisma.service';

type StoredUserRecord = Prisma.UserGetPayload<{
  include: {
    authIdentities: true;
  };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createManual(input: CreateManualUserInput): Promise<StoredUser> {
    const email = this.normalizeEmail(input.email);

    return executePrismaOperation(
      async () => {
        const user = await this.prisma.user.create({
          data: {
            email,
            fullName: input.fullName.trim(),
            systemRoles: [UserSystemRole.user],
            emailVerified: false,
            authIdentities: {
              create: {
                provider: AuthProvider.manual,
                providerSubject: email,
                passwordHash: input.passwordHash,
                passwordSalt: input.passwordSalt,
              },
            },
          },
          include: {
            authIdentities: true,
          },
        });

        return this.toStoredUser(user);
      },
      {
        conflictDetail: 'An account already exists for this email address.',
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );
  }

  async upsertGoogle(input: UpsertGoogleUserInput): Promise<StoredUser> {
    const email = this.normalizeEmail(input.email);
    const existingByGoogle = await this.findByAccount(AuthProvider.google, input.googleSubject);
    if (existingByGoogle) {
      return this.updateGoogleUser(existingByGoogle.id, input);
    }

    const existingByEmail = await this.findByEmail(email);
    if (existingByEmail) {
      return this.updateGoogleUser(existingByEmail.id, input);
    }

    return executePrismaOperation(
      async () => {
        const user = await this.prisma.user.create({
          data: {
            email,
            fullName: input.fullName.trim(),
            avatarUrl: input.avatarUrl,
            systemRoles: [UserSystemRole.user],
            emailVerified: input.emailVerified,
            authIdentities: {
              create: {
                provider: AuthProvider.google,
                providerSubject: input.googleSubject,
              },
            },
          },
          include: {
            authIdentities: true,
          },
        });

        return this.toStoredUser(user);
      },
      {
        conflictDetail: 'The Google account is already linked to another user.',
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );
  }

  async findById(id: string): Promise<StoredUser | undefined> {
    const user = await executePrismaOperation(
      () =>
        this.prisma.user.findUnique({
          where: { id },
          include: {
            authIdentities: true,
          },
        }),
      {
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );

    return user ? this.toStoredUser(user) : undefined;
  }

  async findByEmail(email: string): Promise<StoredUser | undefined> {
    const user = await executePrismaOperation(
      () =>
        this.prisma.user.findUnique({
          where: {
            email: this.normalizeEmail(email),
          },
          include: {
            authIdentities: true,
          },
        }),
      {
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );

    return user ? this.toStoredUser(user) : undefined;
  }

  toPublicUser(user: StoredUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      providers: user.providers,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async updateGoogleUser(
    userId: string,
    input: UpsertGoogleUserInput,
  ): Promise<StoredUser> {
    const user = await executePrismaOperation(
      () =>
        this.prisma.user.update({
          where: { id: userId },
          data: {
            fullName: input.fullName.trim(),
            avatarUrl: input.avatarUrl,
            emailVerified: input.emailVerified,
            authIdentities: {
              upsert: {
                where: {
                  provider_providerSubject: {
                    provider: AuthProvider.google,
                    providerSubject: input.googleSubject,
                  },
                },
                create: {
                  provider: AuthProvider.google,
                  providerSubject: input.googleSubject,
                },
                update: {
                  providerSubject: input.googleSubject,
                },
              },
            },
          },
          include: {
            authIdentities: true,
          },
        }),
      {
        conflictDetail: 'The Google account is already linked to another user.',
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );

    return this.toStoredUser(user);
  }

  private async findByAccount(
    provider: AuthProvider,
    providerSubject: string,
  ): Promise<StoredUser | undefined> {
    const authIdentity = await executePrismaOperation(
      () =>
        this.prisma.authIdentity.findUnique({
          where: {
            provider_providerSubject: {
              provider,
              providerSubject,
            },
          },
          include: {
            user: {
              include: {
                authIdentities: true,
              },
            },
          },
        }),
      {
        dependencyDetail: 'The account store is temporarily unavailable.',
      },
    );

    return authIdentity ? this.toStoredUser(authIdentity.user) : undefined;
  }

  private toStoredUser(user: StoredUserRecord): StoredUser {
    const manualIdentity = user.authIdentities.find(
      (identity) => identity.provider === AuthProvider.manual,
    );
    const googleIdentity = user.authIdentities.find(
      (identity) => identity.provider === AuthProvider.google,
    );

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? undefined,
      roles: user.systemRoles.map((role) => this.toPublicRole(role)),
      providers: user.authIdentities.map((identity) => this.toPublicProvider(identity.provider)),
      emailVerified: user.emailVerified,
      passwordHash: manualIdentity?.passwordHash ?? undefined,
      passwordSalt: manualIdentity?.passwordSalt ?? undefined,
      googleSubject: googleIdentity?.providerSubject,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toPublicProvider(provider: AuthProvider): PublicAuthProvider {
    return provider === AuthProvider.google ? 'google' : 'manual';
  }

  private toPublicRole(role: UserSystemRole): PublicUserRole {
    return role === UserSystemRole.admin ? 'admin' : 'user';
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
