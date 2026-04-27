import type { SupportedMediaType } from '@org/utils';

export type ExternalMediaProvider = 'dropbox' | 'google-drive' | 'direct-url';
export type MediaUploadSource = 'device' | ExternalMediaProvider;

export interface UploadedMediaAssetInput {
  readonly id: string;
  readonly mimeType: string;
  readonly originalName: string;
  readonly type: SupportedMediaType;
  readonly url: string;
}

export interface MediaUploadItem {
  readonly alt: string;
  readonly id: string;
  readonly mimeType?: string;
  readonly originalName?: string;
  readonly progressPercent?: number;
  readonly source: MediaUploadSource;
  readonly type: SupportedMediaType;
  readonly url: string;
  readonly uploadState?: 'uploaded' | 'uploading';
}

export interface MediaUploadProgress {
  readonly fileName: string;
  readonly loadedBytes: number;
  readonly percent: number;
  readonly totalBytes: number;
  readonly uploadId: string;
}

export type MediaUploadProgressListener = (progress: Readonly<MediaUploadProgress>) => void;

export interface MediaUploadRequestOptions {
  readonly onProgress?: MediaUploadProgressListener;
}

export interface MediaUploadProps {
  readonly disabled?: boolean;
  readonly error?: string;
  readonly maxItems?: number;
  readonly onChange: (items: MediaUploadItem[]) => void;
  readonly onUploadFiles: (
    files: File[],
    options?: MediaUploadRequestOptions,
  ) => Promise<readonly UploadedMediaAssetInput[]>;
  readonly value: readonly MediaUploadItem[];
}
