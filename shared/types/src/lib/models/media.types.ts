export type MediaType = 'image' | 'video';
export type MediaAssetIntent = 'listing' | 'catalog' | 'post' | 'profile' | 'event-cover' | 'live';
export type MediaAssetStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'processing'
  | 'ready'
  | 'rejected'
  | 'deleted';
export type MediaModerationStatus = 'pending' | 'approved' | 'flagged' | 'rejected';
export type StorageProvider = 's3';
export type MediaUploadMethod = 'PUT';

export interface Media {
  id: string;
  url: string;
  type: MediaType;
  alt: string;
}

export type MediaUploadSource = 'device' | 'dropbox' | 'google-drive' | 'direct-url' | 'generated';

export interface MediaAssetSummary {
  id: string;
  type: MediaType;
  status: MediaAssetStatus;
  mimeType: string;
  originalName: string;
  source: MediaUploadSource;
  url: string;
  width?: number;
  height?: number;
}

export type UploadedMediaAsset = MediaAssetSummary;

export interface InitiateMediaUploadRequest {
  intent: MediaAssetIntent;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
  source: MediaUploadSource;
}

export interface MediaUploadTarget {
  expiresAt: Date;
  headers: Record<string, string>;
  method: MediaUploadMethod;
  url: string;
}

export interface InitiateMediaUploadResponse {
  mediaAssetId: string;
  upload: MediaUploadTarget;
}

export interface AbortMediaUploadResponse {
  success: true;
}

export interface MediaUploadProgress {
  fileName: string;
  loadedBytes: number;
  percent: number;
  totalBytes: number;
  uploadId: string;
}

export type MediaUploadProgressListener = (progress: Readonly<MediaUploadProgress>) => void;

export interface UploadMediaRequestOptions {
  intent: MediaAssetIntent;
  onProgress?: MediaUploadProgressListener;
  source?: MediaUploadSource;
}
