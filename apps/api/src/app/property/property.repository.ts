import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddressAssignmentRole,
  AddressAssignmentSubjectType,
  CurrencyCode,
  ListingStatus as PrismaListingStatus,
  MediaAssetIntent,
  MediaAssetStatus,
  OwnershipSubjectType,
  PropertyMediaRole,
  PropertyOwnershipRole,
  Prisma,
  PropertyStatus as PrismaPropertyStatus,
} from '@prisma/client';
import type { Address, Media, Property } from '@org/types';
import { executePrismaOperation } from '../database/prisma-exception.mapper';
import { InternalOperationException } from '../errors/internal-operation.exception';
import { ResourceNotFoundException } from '../errors/resource-not-found.exception';
import { PrismaService } from '../database/prisma.service';
import type { CreatePropertyDto, PropertyMediaDto } from './dto/create-property.dto';

type PropertyRepositoryClient = PrismaService | Prisma.TransactionClient;

type PropertyRecord = Prisma.PropertyGetPayload<{
  include: {
    mediaAttachments: {
      orderBy: {
        sortOrder: 'asc';
      };
      include: {
        mediaAsset: true;
      };
    };
    listings: {
      orderBy: {
        createdAt: 'desc';
      };
    };
  };
}>;

interface NormalizedPropertyMediaInput {
  readonly mediaAssetId: string;
  readonly alt: string;
  readonly role: 'cover' | 'gallery';
}

type PropertyAddressAssignmentRecord = Prisma.AddressAssignmentGetPayload<{
  include: {
    address: true;
  };
}>;

const SUPPORTED_CURRENCIES: ReadonlySet<string> = new Set([
  CurrencyCode.NGN,
  CurrencyCode.USD,
  CurrencyCode.CAD,
  CurrencyCode.AUD,
  CurrencyCode.GHS,
  CurrencyCode.KES,
  CurrencyCode.ZAR,
  CurrencyCode.GBP,
  CurrencyCode.EUR,
  CurrencyCode.JPY,
  CurrencyCode.CNY,
  CurrencyCode.INR,
  CurrencyCode.RIPPLE,
]);

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePropertyDto, ownerUserId: string): Promise<Property> {
    const location = this.normalizeLocation(input.location);
    const price = this.normalizePrice(input.price);
    const media = input.media.map((item, index) => this.normalizeMedia(item, index));
    const property = await executePrismaOperation(
      () =>
        this.prisma.$transaction(async (tx) => {
          const mediaAssets = await tx.mediaAsset.findMany({
            where: {
              id: {
                in: media.map((item) => item.mediaAssetId),
              },
              deletedAt: null,
              intent: MediaAssetIntent.listing,
              ownerUserId,
              status: MediaAssetStatus.ready,
            },
          });
          const mediaAssetMap = new Map(mediaAssets.map((item) => [item.id, item]));

          media.forEach((item, index) => {
            if (!mediaAssetMap.has(item.mediaAssetId)) {
              throw new BadRequestException(
                `media.${index}.mediaAssetId must reference a ready listing media asset.`,
              );
            }
          });

          const createdProperty = await tx.property.create({
            data: {
              title: input.title.trim(),
              description: input.description.trim(),
              status: this.toCanonicalPropertyStatus(input.status ?? 'active'),
              mediaAttachments: {
                create: media.map((item, index) => ({
                  alt: item.alt,
                  mediaAssetId: item.mediaAssetId,
                  role: this.toPrismaPropertyMediaRole(item.role),
                  sortOrder: index,
                })),
              },
            },
          });

          const address = await tx.address.create({
            data: {
              city: location.city,
              country: location.country,
              latitude: location.latitude,
              longitude: location.longitude,
            },
          });

          await tx.addressAssignment.create({
            data: {
              addressId: address.id,
              subjectType: AddressAssignmentSubjectType.property,
              subjectId: createdProperty.id,
              role: AddressAssignmentRole.property_location,
              isPrimary: true,
            },
          });

          await tx.propertyOwnership.create({
            data: {
              active: true,
              ownerId: ownerUserId,
              ownerType: OwnershipSubjectType.user,
              propertyId: createdProperty.id,
              role: PropertyOwnershipRole.owner,
            },
          });

          const listing = await tx.listing.create({
            data: {
              propertyId: createdProperty.id,
              title: input.title.trim(),
              description: input.description.trim(),
              priceAmount: price.amount,
              priceCurrency: price.currency as CurrencyCode,
              status: this.toCanonicalListingStatus(input.status ?? 'active'),
            },
          });

          await tx.listingVersion.create({
            data: {
              listingId: listing.id,
              title: listing.title,
              description: listing.description,
              priceAmount: listing.priceAmount,
              priceCurrency: listing.priceCurrency,
            },
          });

          return this.findByIdWithClient(tx, createdProperty.id);
        }),
      {
        dependencyDetail: 'The property store is temporarily unavailable.',
      },
    );

    if (!property) {
      throw new InternalOperationException('Property was created but could not be reloaded.');
    }

    return property;
  }

  async findMany(): Promise<Property[]> {
    return executePrismaOperation(() => this.findProperties(this.prisma, false), {
      dependencyDetail: 'The property store is temporarily unavailable.',
    });
  }

  async findActive(): Promise<Property[]> {
    return executePrismaOperation(() => this.findProperties(this.prisma, true), {
      dependencyDetail: 'The property store is temporarily unavailable.',
    });
  }

  async findById(id: string): Promise<Property> {
    const property = await executePrismaOperation(() => this.findByIdWithClient(this.prisma, id), {
      dependencyDetail: 'The property store is temporarily unavailable.',
      notFoundDetail: `Property ${id} was not found.`,
    });
    if (!property) {
      throw new ResourceNotFoundException(`Property ${id} was not found.`);
    }

    return property;
  }

  private async findProperties(
    client: PropertyRepositoryClient,
    activeOnly: boolean,
  ): Promise<Property[]> {
    const properties = await client.property.findMany({
      where: activeOnly
        ? {
            listings: {
              some: {
                status: PrismaListingStatus.active,
              },
            },
          }
        : {
            listings: {
              some: {},
            },
          },
      orderBy: {
        createdAt: 'desc',
      },
      include: this.includeRelations(),
    });
    const addressMap = await this.readAddressMap(
      client,
      properties.map((property) => property.id),
    );

    return properties
      .map((property) => this.toProperty(property, addressMap.get(property.id)))
      .filter((property): property is Property => property !== undefined);
  }

  private async findByIdWithClient(
    client: PropertyRepositoryClient,
    id: string,
  ): Promise<Property | undefined> {
    const property = await client.property.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
    if (!property) {
      return undefined;
    }

    const addressMap = await this.readAddressMap(client, [property.id]);

    return this.toProperty(property, addressMap.get(property.id));
  }

  private async readAddressMap(
    client: PropertyRepositoryClient,
    propertyIds: readonly string[],
  ): Promise<Map<string, Address>> {
    if (propertyIds.length === 0) {
      return new Map<string, Address>();
    }

    const assignments = await client.addressAssignment.findMany({
      where: {
        subjectType: AddressAssignmentSubjectType.property,
        subjectId: {
          in: [...propertyIds],
        },
        role: AddressAssignmentRole.property_location,
        isPrimary: true,
      },
      include: {
        address: true,
      },
    });

    return new Map<string, Address>(
      assignments.map((assignment) => [assignment.subjectId, this.toAddress(assignment)]),
    );
  }

  private includeRelations(): {
    readonly mediaAttachments: {
      readonly orderBy: { readonly sortOrder: 'asc' };
      readonly include: { readonly mediaAsset: true };
    };
    readonly listings: { readonly orderBy: { readonly createdAt: 'desc' } };
  } {
    return {
      mediaAttachments: {
        orderBy: {
          sortOrder: 'asc',
        },
        include: {
          mediaAsset: true,
        },
      },
      listings: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    };
  }

  private normalizeLocation(input: unknown): Property['location'] {
    const value = this.expectRecord(input, 'location');
    const latitude = value.latitude;
    const longitude = value.longitude;

    return {
      city: this.expectString(value.city, 'location.city'),
      country: this.expectString(value.country, 'location.country'),
      latitude:
        latitude === undefined ? undefined : this.expectNumber(latitude, 'location.latitude'),
      longitude:
        longitude === undefined ? undefined : this.expectNumber(longitude, 'location.longitude'),
    };
  }

  private normalizePrice(input: unknown): Property['price'] {
    const value = this.expectRecord(input, 'price');
    const amount = this.expectNumber(value.amount, 'price.amount');
    const currency = this.expectString(value.currency, 'price.currency').toUpperCase();

    if (amount <= 0) {
      throw new BadRequestException('price.amount must be greater than zero.');
    }
    if (!SUPPORTED_CURRENCIES.has(currency)) {
      throw new BadRequestException(
        `price.currency must be one of ${[...SUPPORTED_CURRENCIES].join(', ')}.`,
      );
    }

    return {
      amount,
      currency,
    };
  }

  private normalizeMedia(input: PropertyMediaDto, index: number): NormalizedPropertyMediaInput {
    const value = this.expectRecord(input, `media.${index}`);

    return {
      mediaAssetId: this.expectString(value.mediaAssetId, `media.${index}.mediaAssetId`),
      alt: this.expectString(value.alt, `media.${index}.alt`),
      role: this.readPropertyMediaRole(value.role, `media.${index}.role`),
    };
  }

  private toProperty(property: PropertyRecord, address?: Address): Property | undefined {
    const primaryListing = this.pickPrimaryListing(property.listings);
    if (!primaryListing || !address) {
      return undefined;
    }

    return {
      id: property.id,
      title: property.title,
      description: property.description,
      location: {
        city: address.city,
        country: address.country,
        latitude: address.latitude,
        longitude: address.longitude,
      },
      price: {
        amount: Number(primaryListing.priceAmount),
        currency: primaryListing.priceCurrency,
      },
      media: property.mediaAttachments.flatMap((item) => {
        if (!item.mediaAsset.publicUrl) {
          return [];
        }

        return [
          {
            id: item.mediaAsset.id,
            url: item.mediaAsset.publicUrl,
            type: item.mediaAsset.type,
            alt: item.alt,
          } satisfies Media,
        ];
      }),
      status: this.toPublicStatusFromListing(primaryListing.status),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  private toAddress(assignment: PropertyAddressAssignmentRecord): Address {
    return {
      line1: assignment.address.line1 ?? undefined,
      line2: assignment.address.line2 ?? undefined,
      city: assignment.address.city,
      region: assignment.address.region ?? undefined,
      postalCode: assignment.address.postalCode ?? undefined,
      country: assignment.address.country,
      latitude: assignment.address.latitude ?? undefined,
      longitude: assignment.address.longitude ?? undefined,
      formatted: assignment.address.formatted ?? undefined,
      landmark: assignment.address.landmark ?? undefined,
    };
  }

  private pickPrimaryListing(
    listings: ReadonlyArray<PropertyRecord['listings'][number]>,
  ): PropertyRecord['listings'][number] | undefined {
    return [...listings].sort((left, right) => {
      const statusDelta = this.listingPriority(right.status) - this.listingPriority(left.status);
      if (statusDelta !== 0) {
        return statusDelta;
      }

      return right.createdAt.getTime() - left.createdAt.getTime();
    })[0];
  }

  private listingPriority(status: PrismaListingStatus): number {
    switch (status) {
      case PrismaListingStatus.active:
        return 5;
      case PrismaListingStatus.under_offer:
        return 4;
      case PrismaListingStatus.sold:
        return 3;
      case PrismaListingStatus.draft:
      case PrismaListingStatus.review:
        return 2;
      case PrismaListingStatus.paused:
        return 1;
      case PrismaListingStatus.archived:
        return 0;
      default:
        return 0;
    }
  }

  private toCanonicalPropertyStatus(status: Property['status']): PrismaPropertyStatus {
    if (status === 'draft') {
      return PrismaPropertyStatus.draft;
    }
    if (status === 'archived') {
      return PrismaPropertyStatus.archived;
    }

    return PrismaPropertyStatus.active;
  }

  private toCanonicalListingStatus(status: Property['status']): PrismaListingStatus {
    if (status === 'draft') {
      return PrismaListingStatus.draft;
    }
    if (status === 'under-offer') {
      return PrismaListingStatus.under_offer;
    }
    if (status === 'sold') {
      return PrismaListingStatus.sold;
    }
    if (status === 'archived') {
      return PrismaListingStatus.archived;
    }

    return PrismaListingStatus.active;
  }

  private toPublicStatusFromListing(status: PrismaListingStatus): Property['status'] {
    switch (status) {
      case PrismaListingStatus.draft:
      case PrismaListingStatus.review:
        return 'draft';
      case PrismaListingStatus.under_offer:
        return 'under-offer';
      case PrismaListingStatus.sold:
        return 'sold';
      case PrismaListingStatus.archived:
        return 'archived';
      default:
        return 'active';
    }
  }

  private toPrismaPropertyMediaRole(role: NormalizedPropertyMediaInput['role']): PropertyMediaRole {
    return role === 'cover' ? PropertyMediaRole.cover : PropertyMediaRole.gallery;
  }

  private readPropertyMediaRole(
    value: unknown,
    field: string,
  ): NormalizedPropertyMediaInput['role'] {
    if (value === undefined) {
      return 'gallery';
    }
    if (value === 'cover' || value === 'gallery') {
      return value;
    }

    throw new BadRequestException(`${field} must be cover or gallery.`);
  }

  private expectRecord(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException(`${field} must be an object.`);
    }

    return value as Record<string, unknown>;
  }

  private expectString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} must be a non-empty string.`);
    }

    return value.trim();
  }

  private expectNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new BadRequestException(`${field} must be a finite number.`);
    }

    return value;
  }
}
