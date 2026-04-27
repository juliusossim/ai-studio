import type {
  AbortMediaUploadResponse,
  AuthResponse,
  AuthUser,
  FeedResponse,
  GoogleOAuthStartResponse,
  InitiateMediaUploadRequest,
  InitiateMediaUploadResponse,
  MediaUploadProgressListener,
  MediaUploadSource,
  MediaUploadTarget,
  Property,
  PropertyInteractionResponse,
  UploadedMediaAsset,
  UploadMediaRequestOptions,
} from '@org/types';
import type {
  FeedRequestOptions,
  RipplesApiClient,
  RipplesApiClientOptions,
} from './api-client.types.js';

export type { FeedRequestOptions, RipplesApiClient, RipplesApiClientOptions };

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

interface XhrUploadTarget {
  onprogress:
    | ((event: { lengthComputable: boolean; loaded: number; total: number }) => void)
    | null;
}

interface XhrLike {
  onerror: (() => void) | null;
  onload: (() => void) | null;
  readonly responseText: string;
  readonly status: number;
  readonly upload: XhrUploadTarget;
  open(method: string, url: string): void;
  send(body: Blob): void;
  setRequestHeader(name: string, value: string): void;
}

interface XhrConstructor {
  new (): XhrLike;
}

export function createRipplesApiClient(options: RipplesApiClientOptions = {}): RipplesApiClient {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? 'http://localhost:3000/api');
  const fetcher = options.fetcher ?? fetch;

  return {
    registerManual: (input) => request<AuthResponse>(fetcher, baseUrl, '/auth/register', input),
    loginManual: (input) => request<AuthResponse>(fetcher, baseUrl, '/auth/login', input),
    refresh: (input = {}) => request<AuthResponse>(fetcher, baseUrl, '/auth/refresh', input),
    logout: (input = {}) => request<{ success: true }>(fetcher, baseUrl, '/auth/logout', input),
    startGoogleOAuth: (input) =>
      request<GoogleOAuthStartResponse>(fetcher, baseUrl, '/auth/oauth/google/start', input),
    completeGoogleOAuth: (input) =>
      request<AuthResponse>(fetcher, baseUrl, '/auth/oauth/google/callback', input),
    getMe: (accessToken) =>
      request<AuthUser>(fetcher, baseUrl, '/auth/me', undefined, {
        authorization: `Bearer ${accessToken}`,
      }),
    createProperty: (input, accessToken) =>
      request<Property>(fetcher, baseUrl, '/properties', input, authorizationHeader(accessToken)),
    initiateMediaUpload: (input, accessToken) =>
      request<InitiateMediaUploadResponse>(
        fetcher,
        baseUrl,
        '/media/uploads/initiate',
        input,
        authorizationHeader(accessToken),
      ),
    completeMediaUpload: (mediaAssetId, accessToken) =>
      request<UploadedMediaAsset>(
        fetcher,
        baseUrl,
        `/media/uploads/${encodeURIComponent(mediaAssetId)}/complete`,
        {},
        authorizationHeader(accessToken),
      ),
    abortMediaUpload: (mediaAssetId, accessToken) =>
      request<AbortMediaUploadResponse>(
        fetcher,
        baseUrl,
        `/media/uploads/${encodeURIComponent(mediaAssetId)}/abort`,
        {},
        authorizationHeader(accessToken),
      ),
    uploadMedia: async (files, accessToken, options) =>
      Promise.all(
        files.map((file) => uploadSingleMediaAsset(fetcher, baseUrl, file, accessToken, options)),
      ),
    getProperties: (accessToken) =>
      request<Property[]>(
        fetcher,
        baseUrl,
        '/properties',
        undefined,
        authorizationHeader(accessToken),
      ),
    getFeed: (input, accessToken) =>
      request<FeedResponse>(
        fetcher,
        baseUrl,
        createFeedPath(input),
        undefined,
        authorizationHeader(accessToken),
      ),
    viewProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/view`,
        input,
        authorizationHeader(accessToken),
      ),
    likeProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/like`,
        input,
        authorizationHeader(accessToken),
      ),
    saveProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/save`,
        input,
        authorizationHeader(accessToken),
      ),
    shareProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/share`,
        input,
        authorizationHeader(accessToken),
      ),
  };
}

async function request<TResponse>(
  fetcher: typeof fetch,
  baseUrl: string,
  path: string,
  body?: object,
  headers: Record<string, string> = {},
): Promise<TResponse> {
  const response = await fetcher(`${baseUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiClientError(readErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  return JSON.parse(text) as unknown;
}

function readErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Request failed.';
  }

  const detail = (payload as Record<string, unknown>).detail;
  if (typeof detail === 'string' && detail.length > 0) {
    return detail;
  }

  const title = (payload as Record<string, unknown>).title;
  if (typeof title === 'string' && title.length > 0) {
    return title;
  }

  const message = (payload as Record<string, unknown>).message;
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string').join(' ');
  }

  return typeof message === 'string' ? message : 'Request failed.';
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function authorizationHeader(accessToken?: string): Record<string, string> {
  return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
}

function createFeedPath(input?: FeedRequestOptions): string {
  const params = new URLSearchParams();
  if (input?.limit) {
    params.set('limit', String(input.limit));
  }
  if (input?.cursor) {
    params.set('cursor', input.cursor);
  }
  const query = params.toString();

  return query ? `/feed?${query}` : '/feed';
}

async function uploadSingleMediaAsset(
  fetcher: typeof fetch,
  baseUrl: string,
  file: File,
  accessToken?: string,
  options?: UploadMediaRequestOptions,
): Promise<UploadedMediaAsset> {
  const uploadId = createUploadTrackingId(file);
  const initiateResponse = await request<InitiateMediaUploadResponse>(
    fetcher,
    baseUrl,
    '/media/uploads/initiate',
    createInitiateMediaUploadRequest(file, options),
    authorizationHeader(accessToken),
  );

  try {
    await uploadToSignedTarget(
      fetcher,
      initiateResponse.upload,
      file,
      uploadId,
      options?.onProgress,
    );

    return await request<UploadedMediaAsset>(
      fetcher,
      baseUrl,
      `/media/uploads/${encodeURIComponent(initiateResponse.mediaAssetId)}/complete`,
      {},
      authorizationHeader(accessToken),
    );
  } catch (error) {
    await abortMediaUploadSilently(fetcher, baseUrl, initiateResponse.mediaAssetId, accessToken);
    throw error;
  }
}

function createInitiateMediaUploadRequest(
  file: File,
  options?: UploadMediaRequestOptions,
): InitiateMediaUploadRequest {
  return {
    intent: options?.intent ?? 'listing',
    mimeType: file.type,
    originalName: file.name,
    sizeBytes: file.size,
    source: readUploadSource(options?.source),
  };
}

function readUploadSource(source: MediaUploadSource | undefined): MediaUploadSource {
  return source ?? 'device';
}

async function uploadToSignedTarget(
  fetcher: typeof fetch,
  target: MediaUploadTarget,
  file: File,
  uploadId: string,
  onProgress?: MediaUploadProgressListener,
): Promise<void> {
  const xhrConstructor = readXhrConstructor();
  if (onProgress && xhrConstructor) {
    await uploadToSignedTargetWithXhr(target, file, uploadId, onProgress, xhrConstructor);

    return;
  }

  const response = await fetcher(target.url, {
    method: target.method,
    credentials: 'omit',
    headers: target.headers,
    body: file,
  });

  if (!response.ok) {
    const payload = await parseErrorPayload(response);
    throw new ApiClientError(readErrorMessage(payload), response.status, payload);
  }
}

async function uploadToSignedTargetWithXhr(
  target: MediaUploadTarget,
  file: File,
  uploadId: string,
  onProgress: MediaUploadProgressListener,
  XhrImplementation: XhrConstructor,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = new XhrImplementation();

    request.open(target.method, target.url);
    Object.entries(target.headers).forEach(([name, value]) => {
      request.setRequestHeader(name, value);
    });
    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress({
        fileName: file.name,
        loadedBytes: event.loaded,
        percent: Math.min(100, Math.round((event.loaded / event.total) * 100)),
        totalBytes: event.total,
        uploadId,
      });
    };
    request.onerror = () => {
      reject(new ApiClientError('Signed upload failed.', request.status || 0, undefined));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress({
          fileName: file.name,
          loadedBytes: file.size,
          percent: 100,
          totalBytes: file.size,
          uploadId,
        });
        resolve();

        return;
      }

      reject(
        new ApiClientError(readXhrErrorMessage(request), request.status, request.responseText),
      );
    };
    request.send(file);
  });
}

async function abortMediaUploadSilently(
  fetcher: typeof fetch,
  baseUrl: string,
  mediaAssetId: string,
  accessToken?: string,
): Promise<void> {
  try {
    await request<AbortMediaUploadResponse>(
      fetcher,
      baseUrl,
      `/media/uploads/${encodeURIComponent(mediaAssetId)}/abort`,
      {},
      authorizationHeader(accessToken),
    );
  } catch {
    // Preserve the original upload failure.
  }
}

async function parseErrorPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { detail: text };
  }
}

function readXhrErrorMessage(request: XhrLike): string {
  const responseText = request.responseText?.trim();
  if (!responseText) {
    return 'Signed upload failed.';
  }

  try {
    return readErrorMessage(JSON.parse(responseText) as unknown);
  } catch {
    return responseText;
  }
}

function createUploadTrackingId(file: File): string {
  return [file.name, String(file.size), String(file.lastModified)].join(':');
}

function readXhrConstructor(): XhrConstructor | undefined {
  return (globalThis as { XMLHttpRequest?: XhrConstructor }).XMLHttpRequest;
}
