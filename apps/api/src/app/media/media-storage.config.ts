import { Injectable } from '@nestjs/common';
import { getEnv, getEnvBoolean, getEnvInteger, requireEnv } from '@org/config';

const defaultMaxImageBytes = 20 * 1024 * 1024;
const defaultMaxVideoBytes = 200 * 1024 * 1024;
const defaultUploadUrlTtlSeconds = 900;

type MediaKind = 'image' | 'video';

@Injectable()
export class MediaStorageConfigService {
  readonly accessKeyId = getEnv('MEDIA_STORAGE_ACCESS_KEY_ID');
  readonly bucket = requireEnv('MEDIA_STORAGE_BUCKET');
  readonly endpoint = getEnv('MEDIA_STORAGE_ENDPOINT');
  readonly forcePathStyle = getEnvBoolean('MEDIA_STORAGE_FORCE_PATH_STYLE', false) ?? false;
  readonly keyPrefix = this.normalizePrefix(getEnv('MEDIA_STORAGE_KEY_PREFIX'));
  readonly maxImageBytes =
    getEnvInteger('MEDIA_MAX_IMAGE_BYTES', defaultMaxImageBytes) ?? defaultMaxImageBytes;
  readonly maxVideoBytes =
    getEnvInteger('MEDIA_MAX_VIDEO_BYTES', defaultMaxVideoBytes) ?? defaultMaxVideoBytes;
  readonly provider = requireEnv('MEDIA_STORAGE_PROVIDER');
  readonly publicBaseUrl = this.normalizePublicBaseUrl(requireEnv('MEDIA_STORAGE_PUBLIC_BASE_URL'));
  readonly region = requireEnv('MEDIA_STORAGE_REGION');
  readonly secretAccessKey = getEnv('MEDIA_STORAGE_SECRET_ACCESS_KEY');
  readonly sessionToken = getEnv('MEDIA_STORAGE_SESSION_TOKEN');
  readonly uploadUrlTtlSeconds =
    getEnvInteger('MEDIA_UPLOAD_URL_TTL_SECONDS', defaultUploadUrlTtlSeconds) ??
    defaultUploadUrlTtlSeconds;

  buildObjectKey(userId: string, intent: string, assetId: string, extension: string): string {
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const basePath = [
      this.keyPrefix,
      'users',
      userId,
      intent,
      year,
      month,
      `${assetId}.${extension}`,
    ]
      .filter((segment) => segment.length > 0)
      .join('/');

    return basePath;
  }

  buildPublicUrl(objectKey: string): string {
    return `${this.publicBaseUrl}/${encodeObjectKey(objectKey)}`;
  }

  readMaxBytes(kind: MediaKind): number {
    return kind === 'image' ? this.maxImageBytes : this.maxVideoBytes;
  }

  private normalizePrefix(value: string | undefined): string {
    if (!value) {
      return '';
    }

    return value.trim().replace(/^\/+/, '').replace(/\/+$/, '');
  }

  private normalizePublicBaseUrl(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value;
  }
}

function encodeObjectKey(objectKey: string): string {
  return objectKey
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}
