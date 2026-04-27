import { detectSupportedMediaType, type SupportedMediaType } from '@org/utils';
import type {
  ExternalMediaProvider,
  MediaUploadItem,
  MediaUploadSource,
} from './media-upload.types';

export const externalMediaProviders = [
  {
    description: 'Paste a public media URL.',
    label: 'Web link',
    value: 'direct-url',
  },
  {
    description: 'Paste a public Dropbox share link.',
    label: 'Dropbox',
    value: 'dropbox',
  },
  {
    description: 'Paste a public Google Drive file link.',
    label: 'Google Drive',
    value: 'google-drive',
  },
] as const satisfies readonly {
  readonly description: string;
  readonly label: string;
  readonly value: ExternalMediaProvider;
}[];

export function createMediaUploadId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMediaUploadItem(input: {
  readonly alt: string;
  readonly id?: string;
  readonly mimeType?: string;
  readonly originalName?: string;
  readonly progressPercent?: number;
  readonly source: MediaUploadSource;
  readonly type: SupportedMediaType;
  readonly url: string;
  readonly uploadState?: 'uploaded' | 'uploading';
}): MediaUploadItem {
  return {
    alt: input.alt,
    id: input.id ?? createMediaUploadId(),
    mimeType: input.mimeType,
    originalName: input.originalName,
    progressPercent: input.progressPercent,
    source: input.source,
    type: input.type,
    url: input.url,
    uploadState: input.uploadState,
  };
}

export function normalizeExternalMediaUrl(
  provider: ExternalMediaProvider,
  inputUrl: string,
): string {
  const url = new URL(inputUrl.trim());

  if (provider === 'dropbox') {
    url.hostname = 'dl.dropboxusercontent.com';
    url.searchParams.delete('dl');
    url.searchParams.set('raw', '1');

    return url.toString();
  }

  if (provider === 'google-drive') {
    const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get('id');

    if (!fileId) {
      throw new Error('Enter a valid Google Drive file link.');
    }

    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  }

  return url.toString();
}

export function resolveImportedMediaType(input: {
  readonly preferredType: SupportedMediaType;
  readonly provider: ExternalMediaProvider;
  readonly url: string;
}): SupportedMediaType {
  const normalizedUrl = normalizeExternalMediaUrl(input.provider, input.url);

  return (
    detectSupportedMediaType({
      fileNameOrUrl: normalizedUrl,
    }) ?? input.preferredType
  );
}

export function readDefaultAlt(candidate: string): string {
  const fileName = candidate.split('?')[0].split('#')[0].split('/').pop() ?? candidate;
  const withoutExtension = fileName.replace(/\.[^.]+$/, '');
  const cleaned = withoutExtension.replace(/[-_]+/g, ' ').trim();

  return cleaned || 'Listing media';
}

export function readMediaUploadErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while processing media.';
}

export function clampMediaUploadItems(
  existingItems: readonly MediaUploadItem[],
  incomingItems: readonly MediaUploadItem[],
  maxItems: number,
): MediaUploadItem[] {
  return [...existingItems, ...incomingItems].slice(0, maxItems);
}

export function createLocalUploadTrackingId(file: File): string {
  return [file.name, String(file.size), String(file.lastModified)].join(':');
}

export function readExternalUrlPlaceholder(provider: ExternalMediaProvider): string {
  if (provider === 'dropbox') {
    return 'https://www.dropbox.com/...';
  }

  if (provider === 'google-drive') {
    return 'https://drive.google.com/file/d/...';
  }

  return 'https://example.com/media.jpg';
}

export function readAvailabilityBadgeVariant(
  configured: boolean,
): 'default' | 'secondary' | 'outline' {
  if (configured) {
    return 'default';
  }

  return 'outline';
}
