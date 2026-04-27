import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  MediaAssetIntent as PrismaMediaAssetIntent,
  MediaAssetSource as PrismaMediaAssetSource,
  MediaAssetStatus as PrismaMediaAssetStatus,
  MediaModerationStatus,
  MediaType as PrismaMediaType,
  Prisma,
  StorageProvider,
} from '@prisma/client';
import type {
  AbortMediaUploadResponse,
  InitiateMediaUploadResponse,
  MediaAssetIntent,
  MediaAssetStatus,
  MediaAssetSummary,
  MediaType,
  MediaUploadSource,
  UploadedMediaAsset,
} from '@org/types';
import { getPreferredExtensionForMimeType, getMediaTypeFromFileName } from '@org/utils';
import { randomUUID } from 'node:crypto';
import { executePrismaOperation } from '../database/prisma-exception.mapper';
import { PrismaService } from '../database/prisma.service';
import { DependencyFailureException } from '../errors/dependency-failure.exception';
import { ResourceNotFoundException } from '../errors/resource-not-found.exception';
import { UnsupportedMediaException } from '../errors/unsupported-media.exception';
import { MediaStorageConfigService } from './media-storage.config';
import type { InitiateMediaUploadDto } from './dto/initiate-media-upload.dto';
import { detectMediaSignature, type VerifiedMediaSignature } from './media-signature';
import { MEDIA_STORAGE_ADAPTER, type MediaStorageAdapter } from './media-storage.types';

type MediaAssetRecord = Prisma.MediaAssetGetPayload<Record<string, never>>;

interface DeclaredUploadProfile {
  readonly extension: string;
  readonly type: MediaType;
}

const supportedDeclaredUploads = {
  'image/gif': {
    extension: 'gif',
    type: 'image',
  },
  'image/jpeg': {
    extension: 'jpg',
    type: 'image',
  },
  'image/jpg': {
    extension: 'jpg',
    type: 'image',
  },
  'image/png': {
    extension: 'png',
    type: 'image',
  },
  'image/webp': {
    extension: 'webp',
    type: 'image',
  },
  'video/mp4': {
    extension: 'mp4',
    type: 'video',
  },
  'video/quicktime': {
    extension: 'mov',
    type: 'video',
  },
  'video/webm': {
    extension: 'webm',
    type: 'video',
  },
} as const satisfies Record<string, DeclaredUploadProfile>;

const signatureReadBytes = 4096;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageConfig: MediaStorageConfigService,
    @Inject(MEDIA_STORAGE_ADAPTER)
    private readonly storageAdapter: MediaStorageAdapter,
  ) {}

  async initiateUpload(
    input: Readonly<InitiateMediaUploadDto>,
    ownerUserId: string,
  ): Promise<InitiateMediaUploadResponse> {
    const profile = this.readDeclaredUploadProfile(input.originalName, input.mimeType);
    const maxBytes = this.storageConfig.readMaxBytes(profile.type);

    if (input.sizeBytes > maxBytes) {
      throw new BadRequestException(
        `Uploaded ${profile.type} files must not exceed ${maxBytes} bytes.`,
      );
    }

    const mediaAssetId = randomUUID();
    const objectKey = this.storageConfig.buildObjectKey(
      ownerUserId,
      input.intent,
      mediaAssetId,
      profile.extension,
    );
    const uploadTarget = await this.createUploadTarget({
      mimeType: normalizeMimeType(input.mimeType),
      objectKey,
    });

    await executePrismaOperation(
      () =>
        this.prisma.mediaAsset.create({
          data: {
            id: mediaAssetId,
            bucket: this.storageConfig.bucket,
            intent: this.toPrismaIntent(input.intent),
            mimeType: normalizeMimeType(input.mimeType),
            moderationStatus: MediaModerationStatus.pending,
            objectKey,
            originalName: input.originalName,
            ownerUserId,
            sizeBytes: BigInt(input.sizeBytes),
            source: this.toPrismaSource(input.source),
            status: PrismaMediaAssetStatus.pending_upload,
            storageProvider: this.toPrismaStorageProvider(),
            type: this.toPrismaMediaType(profile.type),
          },
        }),
      {
        dependencyDetail: 'Media storage metadata is temporarily unavailable.',
      },
    );

    return {
      mediaAssetId,
      upload: uploadTarget,
    };
  }

  async completeUpload(mediaAssetId: string, ownerUserId: string): Promise<UploadedMediaAsset> {
    const mediaAsset = await this.readOwnedAsset(mediaAssetId, ownerUserId);

    if (mediaAsset.status === PrismaMediaAssetStatus.ready && mediaAsset.publicUrl) {
      return this.toUploadedMediaAsset(mediaAsset);
    }

    if (mediaAsset.status !== PrismaMediaAssetStatus.pending_upload) {
      throw new BadRequestException('This media upload cannot be completed in its current state.');
    }

    const metadata = await this.readStoredObjectMetadata(mediaAsset);
    const verifiedSignature = await this.readVerifiedSignature(mediaAsset);
    const normalizedContentType = verifiedSignature.mimeType;
    const declaredProfile = this.readDeclaredUploadProfile(
      mediaAsset.originalName ?? mediaAsset.objectKey,
      mediaAsset.mimeType,
    );

    if (declaredProfile.type !== verifiedSignature.type) {
      throw new UnsupportedMediaException(
        'Uploaded media type does not match the initiated upload.',
      );
    }

    const expectedSize = mediaAsset.sizeBytes ? Number(mediaAsset.sizeBytes) : undefined;
    if (expectedSize !== undefined && metadata.contentLength !== undefined) {
      if (metadata.contentLength !== expectedSize) {
        throw new BadRequestException('Uploaded media size does not match the initiated upload.');
      }
    }

    const updatedAsset = await executePrismaOperation(
      () =>
        this.prisma.mediaAsset.update({
          where: {
            id: mediaAsset.id,
          },
          data: {
            checksum: metadata.eTag,
            mimeType: normalizedContentType,
            moderationStatus: MediaModerationStatus.pending,
            processedAt: new Date(),
            publicUrl: this.storageConfig.buildPublicUrl(mediaAsset.objectKey),
            sizeBytes:
              metadata.contentLength !== undefined
                ? BigInt(metadata.contentLength)
                : mediaAsset.sizeBytes,
            status: PrismaMediaAssetStatus.ready,
            updatedAt: new Date(),
            verifiedFormat: verifiedSignature.format,
          },
        }),
      {
        dependencyDetail: 'Media storage metadata is temporarily unavailable.',
      },
    );

    return this.toUploadedMediaAsset(updatedAsset);
  }

  private async readVerifiedSignature(
    mediaAsset: MediaAssetRecord,
  ): Promise<VerifiedMediaSignature> {
    let objectBytes: Uint8Array | null;

    try {
      objectBytes = await this.storageAdapter.readObjectBytes(
        mediaAsset.bucket,
        mediaAsset.objectKey,
        signatureReadBytes,
      );
    } catch {
      throw new DependencyFailureException('Media storage is temporarily unavailable.');
    }

    if (!objectBytes || objectBytes.length === 0) {
      throw new BadRequestException('The uploaded media object could not be verified.');
    }

    const verifiedSignature = detectMediaSignature(objectBytes);
    if (!verifiedSignature) {
      throw new UnsupportedMediaException(
        'Uploaded media content could not be verified against a supported format.',
      );
    }

    return verifiedSignature;
  }

  async abortUpload(mediaAssetId: string, ownerUserId: string): Promise<AbortMediaUploadResponse> {
    const mediaAsset = await this.readOwnedAsset(mediaAssetId, ownerUserId);

    if (mediaAsset.status === PrismaMediaAssetStatus.ready) {
      throw new BadRequestException('Completed media assets cannot be aborted.');
    }

    await this.deleteStoredObject(mediaAsset);

    await executePrismaOperation(
      () =>
        this.prisma.mediaAsset.update({
          where: {
            id: mediaAsset.id,
          },
          data: {
            deletedAt: new Date(),
            rejectionReason: mediaAsset.rejectionReason ?? 'Upload aborted by client.',
            status: PrismaMediaAssetStatus.deleted,
            updatedAt: new Date(),
          },
        }),
      {
        dependencyDetail: 'Media storage metadata is temporarily unavailable.',
      },
    );

    return { success: true };
  }

  private async createUploadTarget(input: {
    readonly mimeType: string;
    readonly objectKey: string;
  }): Promise<InitiateMediaUploadResponse['upload']> {
    try {
      return await this.storageAdapter.createUploadTarget({
        bucket: this.storageConfig.bucket,
        cacheControl: 'public, max-age=31536000, immutable',
        contentType: input.mimeType,
        objectKey: input.objectKey,
      });
    } catch {
      throw new DependencyFailureException('Media upload targets are temporarily unavailable.');
    }
  }

  private async deleteStoredObject(mediaAsset: MediaAssetRecord): Promise<void> {
    try {
      await this.storageAdapter.deleteObject(mediaAsset.bucket, mediaAsset.objectKey);
    } catch {
      throw new DependencyFailureException('Media storage is temporarily unavailable.');
    }
  }

  private async readOwnedAsset(
    mediaAssetId: string,
    ownerUserId: string,
  ): Promise<MediaAssetRecord> {
    const mediaAsset = await executePrismaOperation(
      () =>
        this.prisma.mediaAsset.findFirst({
          where: {
            deletedAt: null,
            id: mediaAssetId,
            ownerUserId,
          },
        }),
      {
        dependencyDetail: 'Media storage metadata is temporarily unavailable.',
      },
    );

    if (!mediaAsset) {
      throw new ResourceNotFoundException(`Media asset ${mediaAssetId} was not found.`);
    }

    return mediaAsset;
  }

  private async readStoredObjectMetadata(mediaAsset: MediaAssetRecord): Promise<{
    readonly contentLength?: number;
    readonly contentType?: string;
    readonly eTag?: string;
  }> {
    let metadata: Awaited<ReturnType<MediaStorageAdapter['readObjectMetadata']>>;

    try {
      metadata = await this.storageAdapter.readObjectMetadata(
        mediaAsset.bucket,
        mediaAsset.objectKey,
      );
    } catch {
      throw new DependencyFailureException('Media storage is temporarily unavailable.');
    }

    if (!metadata) {
      throw new BadRequestException('The uploaded media object was not found in storage.');
    }

    return metadata;
  }

  private readDeclaredUploadProfile(originalName: string, mimeType: string): DeclaredUploadProfile {
    const normalizedMimeType = normalizeMimeType(mimeType);
    const profile = readSupportedDeclaredUpload(normalizedMimeType);

    if (!profile) {
      throw new UnsupportedMediaException(`Unsupported media type "${mimeType}".`);
    }

    const fileNameType = getMediaTypeFromFileName(originalName);
    if (fileNameType && fileNameType !== profile.type) {
      throw new UnsupportedMediaException(
        'Uploaded media file name does not match the declared media type.',
      );
    }

    const preferredExtension = getPreferredExtensionForMimeType(normalizedMimeType);
    if (preferredExtension && preferredExtension !== profile.extension) {
      throw new UnsupportedMediaException(`Unsupported storage extension for "${mimeType}".`);
    }

    return profile;
  }

  private toPrismaIntent(intent: MediaAssetIntent): PrismaMediaAssetIntent {
    if (intent === 'event-cover') {
      return PrismaMediaAssetIntent.event_cover;
    }

    return intent as PrismaMediaAssetIntent;
  }

  private toPrismaMediaType(type: MediaType): PrismaMediaType {
    return type === 'video' ? PrismaMediaType.video : PrismaMediaType.image;
  }

  private toPrismaSource(source: MediaUploadSource): PrismaMediaAssetSource {
    if (source === 'google-drive') {
      return PrismaMediaAssetSource.google_drive;
    }

    if (source === 'direct-url') {
      return PrismaMediaAssetSource.direct_url;
    }

    return source as PrismaMediaAssetSource;
  }

  private toPrismaStorageProvider(): StorageProvider {
    return StorageProvider.s3;
  }

  private toUploadedMediaAsset(mediaAsset: MediaAssetRecord): UploadedMediaAsset {
    return {
      ...this.toMediaAssetSummary(mediaAsset),
      url: mediaAsset.publicUrl ?? this.storageConfig.buildPublicUrl(mediaAsset.objectKey),
    };
  }

  private toMediaAssetSummary(mediaAsset: MediaAssetRecord): Omit<MediaAssetSummary, 'url'> {
    return {
      id: mediaAsset.id,
      mimeType: mediaAsset.mimeType,
      originalName: mediaAsset.originalName ?? mediaAsset.objectKey,
      source: this.readMediaUploadSource(mediaAsset.source),
      status: this.readMediaAssetStatus(mediaAsset.status),
      type: mediaAsset.type === PrismaMediaType.video ? 'video' : 'image',
      ...(typeof mediaAsset.width === 'number' ? { width: mediaAsset.width } : {}),
      ...(typeof mediaAsset.height === 'number' ? { height: mediaAsset.height } : {}),
    };
  }

  private readMediaAssetStatus(status: PrismaMediaAssetStatus): MediaAssetStatus {
    return status as MediaAssetStatus;
  }

  private readMediaUploadSource(source: PrismaMediaAssetSource): MediaUploadSource {
    if (source === PrismaMediaAssetSource.google_drive) {
      return 'google-drive';
    }

    if (source === PrismaMediaAssetSource.direct_url) {
      return 'direct-url';
    }

    return source as MediaUploadSource;
  }
}

function normalizeMimeType(mimeType: string): string {
  return mimeType.trim().toLowerCase();
}

function readSupportedDeclaredUpload(mimeType: string): DeclaredUploadProfile | undefined {
  if (mimeType in supportedDeclaredUploads) {
    return supportedDeclaredUploads[mimeType as keyof typeof supportedDeclaredUploads];
  }

  return undefined;
}
