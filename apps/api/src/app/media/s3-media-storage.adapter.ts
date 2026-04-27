import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { MediaStorageConfigService } from './media-storage.config';
import type {
  CreateUploadTargetInput,
  MediaStorageAdapter,
  StoredObjectMetadata,
} from './media-storage.types';

@Injectable()
export class S3MediaStorageAdapter implements MediaStorageAdapter {
  private readonly client: S3Client;

  constructor(private readonly config: MediaStorageConfigService) {
    this.client = new S3Client({
      region: this.config.region,
      ...(this.config.endpoint ? { endpoint: this.config.endpoint } : {}),
      ...(this.config.forcePathStyle ? { forcePathStyle: true } : {}),
      ...(this.config.accessKeyId && this.config.secretAccessKey
        ? {
            credentials: {
              accessKeyId: this.config.accessKeyId,
              secretAccessKey: this.config.secretAccessKey,
              ...(this.config.sessionToken ? { sessionToken: this.config.sessionToken } : {}),
            },
          }
        : {}),
    });
  }

  async createUploadTarget(input: Readonly<CreateUploadTargetInput>): Promise<{
    expiresAt: Date;
    headers: Record<string, string>;
    method: 'PUT';
    url: string;
  }> {
    const command = new PutObjectCommand({
      Bucket: input.bucket,
      Key: input.objectKey,
      CacheControl: input.cacheControl,
      ContentType: input.contentType,
    });
    const url = await getSignedUrl(this.client, command, {
      expiresIn: this.config.uploadUrlTtlSeconds,
    });

    return {
      expiresAt: new Date(Date.now() + this.config.uploadUrlTtlSeconds * 1000),
      headers: {
        'cache-control': input.cacheControl,
        'content-type': input.contentType,
      },
      method: 'PUT',
      url,
    };
  }

  async deleteObject(bucket: string, objectKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      }),
    );
  }

  async readObjectBytes(
    bucket: string,
    objectKey: string,
    maxBytes: number,
  ): Promise<Uint8Array | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Range: `bytes=0-${Math.max(0, maxBytes - 1)}`,
        }),
      );

      if (!response.Body) {
        return new Uint8Array();
      }

      return await response.Body.transformToByteArray();
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async readObjectMetadata(
    bucket: string,
    objectKey: string,
  ): Promise<StoredObjectMetadata | null> {
    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: objectKey,
        }),
      );

      return {
        ...(typeof response.ContentLength === 'number'
          ? { contentLength: response.ContentLength }
          : {}),
        ...(response.ContentType ? { contentType: response.ContentType } : {}),
        ...(response.ETag ? { eTag: response.ETag.replaceAll('"', '') } : {}),
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }
}

function isNotFoundError(error: unknown): boolean {
  if (error instanceof S3ServiceException) {
    return error.name === 'NotFound' || error.$metadata.httpStatusCode === 404;
  }

  return false;
}
