import {
  MediaAssetSource,
  MediaAssetStatus,
  MediaModerationStatus,
  MediaType,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MediaStorageConfigService } from './media-storage.config';
import { MediaService } from './media.service';
import { type MediaStorageAdapter } from './media-storage.types';

describe('MediaService', () => {
  const originalEnv = process.env;
  let prisma: {
    mediaAsset: {
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };
  let storageAdapter: jest.Mocked<MediaStorageAdapter>;
  let service: MediaService;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MEDIA_STORAGE_BUCKET: 'ripples-media-test',
      MEDIA_STORAGE_PROVIDER: 's3',
      MEDIA_STORAGE_PUBLIC_BASE_URL: 'https://media.ripples.test',
      MEDIA_STORAGE_REGION: 'us-east-1',
    };

    prisma = {
      mediaAsset: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };
    storageAdapter = {
      createUploadTarget: jest.fn(),
      deleteObject: jest.fn(),
      readObjectBytes: jest.fn(),
      readObjectMetadata: jest.fn(),
    };
    service = new MediaService(
      prisma as unknown as PrismaService,
      new MediaStorageConfigService(),
      storageAdapter,
    );
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('initiates signed uploads for supported listing media', async () => {
    prisma.mediaAsset.create.mockResolvedValue(undefined);
    storageAdapter.createUploadTarget.mockResolvedValue({
      expiresAt: new Date('2026-04-24T12:00:00.000Z'),
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-type': 'image/jpeg',
      },
      method: 'PUT',
      url: 'https://storage.example.com/upload',
    });

    const response = await service.initiateUpload(
      {
        intent: 'listing',
        mimeType: 'image/jpeg',
        originalName: 'listing.jpg',
        sizeBytes: 1024,
        source: 'device',
      },
      'user-1',
    );

    expect(response.upload.method).toBe('PUT');
    expect(response.upload.url).toBe('https://storage.example.com/upload');
    expect(prisma.mediaAsset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bucket: 'ripples-media-test',
          intent: 'listing',
          mimeType: 'image/jpeg',
          ownerUserId: 'user-1',
          source: 'device',
          status: 'pending_upload',
          storageProvider: 's3',
          type: 'image',
        }),
      }),
    );
  });

  it('completes uploads after the object is present in storage', async () => {
    prisma.mediaAsset.findFirst.mockResolvedValue(
      createMediaAsset({
        id: 'media-asset-1',
        mimeType: 'image/jpeg',
        objectKey: 'users/user-1/listing/2026/04/media-asset-1.jpg',
        originalName: 'listing.jpg',
        ownerUserId: 'user-1',
        publicUrl: null,
        sizeBytes: BigInt(1024),
        source: MediaAssetSource.device,
        status: MediaAssetStatus.pending_upload,
        type: MediaType.image,
      }),
    );
    storageAdapter.readObjectMetadata.mockResolvedValue({
      contentLength: 1024,
      contentType: 'image/jpeg',
      eTag: 'etag-1',
    });
    storageAdapter.readObjectBytes.mockResolvedValue(Uint8Array.from([0xff, 0xd8, 0xff, 0xdb]));
    prisma.mediaAsset.update.mockResolvedValue(
      createMediaAsset({
        id: 'media-asset-1',
        mimeType: 'image/jpeg',
        objectKey: 'users/user-1/listing/2026/04/media-asset-1.jpg',
        originalName: 'listing.jpg',
        ownerUserId: 'user-1',
        processedAt: new Date('2026-04-24T12:00:00.000Z'),
        publicUrl: 'https://media.ripples.test/users/user-1/listing/2026/04/media-asset-1.jpg',
        sizeBytes: BigInt(1024),
        source: MediaAssetSource.device,
        status: MediaAssetStatus.ready,
        type: MediaType.image,
        verifiedFormat: 'jpeg',
      }),
    );

    const response = await service.completeUpload('media-asset-1', 'user-1');

    expect(response.status).toBe('ready');
    expect(response.url).toBe(
      'https://media.ripples.test/users/user-1/listing/2026/04/media-asset-1.jpg',
    );
    expect(prisma.mediaAsset.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          checksum: 'etag-1',
          moderationStatus: 'pending',
          publicUrl: 'https://media.ripples.test/users/user-1/listing/2026/04/media-asset-1.jpg',
          status: 'ready',
          verifiedFormat: 'jpeg',
        }),
      }),
    );
  });

  it('aborts pending uploads and marks the asset deleted', async () => {
    prisma.mediaAsset.findFirst.mockResolvedValue(
      createMediaAsset({
        id: 'media-asset-1',
        mimeType: 'image/jpeg',
        objectKey: 'users/user-1/listing/2026/04/media-asset-1.jpg',
        originalName: 'listing.jpg',
        ownerUserId: 'user-1',
        publicUrl: null,
        sizeBytes: BigInt(1024),
        source: MediaAssetSource.device,
        status: MediaAssetStatus.pending_upload,
        type: MediaType.image,
      }),
    );
    prisma.mediaAsset.update.mockResolvedValue(
      createMediaAsset({
        id: 'media-asset-1',
        mimeType: 'image/jpeg',
        objectKey: 'users/user-1/listing/2026/04/media-asset-1.jpg',
        originalName: 'listing.jpg',
        ownerUserId: 'user-1',
        publicUrl: null,
        sizeBytes: BigInt(1024),
        source: MediaAssetSource.device,
        status: MediaAssetStatus.deleted,
        type: MediaType.image,
      }),
    );

    const response = await service.abortUpload('media-asset-1', 'user-1');

    expect(response).toEqual({ success: true });
    expect(storageAdapter.deleteObject).toHaveBeenCalledWith(
      'ripples-media-test',
      'users/user-1/listing/2026/04/media-asset-1.jpg',
    );
    expect(prisma.mediaAsset.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'deleted',
        }),
      }),
    );
  });
});

function createMediaAsset(
  overrides: Partial<{
    id: string;
    mimeType: string;
    objectKey: string;
    originalName: string | null;
    ownerUserId: string;
    processedAt: Date | null;
    publicUrl: string | null;
    sizeBytes: bigint | null;
    source: MediaAssetSource;
    status: MediaAssetStatus;
    type: MediaType;
    verifiedFormat: string | null;
  }>,
): {
  id: string;
  ownerUserId: string;
  intent: 'listing';
  type: MediaType;
  source: MediaAssetSource;
  storageProvider: 's3';
  bucket: string;
  objectKey: string;
  status: MediaAssetStatus;
  mimeType: string;
  verifiedFormat: string | null;
  sizeBytes: bigint | null;
  checksum: string | null;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  blurhash: string | null;
  moderationStatus: MediaModerationStatus;
  originalName: string | null;
  publicUrl: string | null;
  rejectionReason: string | null;
  processedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: overrides.id ?? 'media-asset-1',
    ownerUserId: overrides.ownerUserId ?? 'user-1',
    intent: 'listing',
    type: overrides.type ?? MediaType.image,
    source: overrides.source ?? MediaAssetSource.device,
    storageProvider: 's3',
    bucket: 'ripples-media-test',
    objectKey: overrides.objectKey ?? 'users/user-1/listing/2026/04/media-asset-1.jpg',
    status: overrides.status ?? MediaAssetStatus.pending_upload,
    mimeType: overrides.mimeType ?? 'image/jpeg',
    verifiedFormat: overrides.verifiedFormat ?? null,
    sizeBytes: overrides.sizeBytes ?? BigInt(1024),
    checksum: null,
    width: null,
    height: null,
    durationMs: null,
    blurhash: null,
    moderationStatus: MediaModerationStatus.pending,
    originalName: overrides.originalName ?? 'listing.jpg',
    publicUrl: overrides.publicUrl ?? null,
    rejectionReason: null,
    processedAt: overrides.processedAt ?? null,
    deletedAt: null,
    createdAt: new Date('2026-04-24T10:00:00.000Z'),
    updatedAt: new Date('2026-04-24T10:00:00.000Z'),
  };
}
