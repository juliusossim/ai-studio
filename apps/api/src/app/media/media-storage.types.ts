export interface CreateUploadTargetInput {
  readonly bucket: string;
  readonly cacheControl: string;
  readonly contentType: string;
  readonly objectKey: string;
}

export interface StoredObjectMetadata {
  readonly contentLength?: number;
  readonly contentType?: string;
  readonly eTag?: string;
}

export interface MediaStorageAdapter {
  createUploadTarget(input: CreateUploadTargetInput): Promise<{
    expiresAt: Date;
    headers: Record<string, string>;
    method: 'PUT';
    url: string;
  }>;
  deleteObject(bucket: string, objectKey: string): Promise<void>;
  readObjectBytes(bucket: string, objectKey: string, maxBytes: number): Promise<Uint8Array | null>;
  readObjectMetadata(bucket: string, objectKey: string): Promise<StoredObjectMetadata | null>;
}

export const MEDIA_STORAGE_ADAPTER = Symbol('MEDIA_STORAGE_ADAPTER');
