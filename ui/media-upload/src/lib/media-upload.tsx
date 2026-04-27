import {
  buildMediaInputAcceptAttribute,
  detectSupportedMediaType,
  type SupportedMediaType,
} from '@org/utils';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactElement,
} from 'react';
import {
  readDropboxPickerAvailability,
  readDropboxPickerConfig,
  readGooglePickerAvailability,
  readGooglePickerConfig,
} from './media-provider-config';
import { pickDropboxFiles, pickGoogleDriveFiles } from './media-pickers';
import type {
  ExternalMediaProvider,
  MediaUploadItem,
  MediaUploadProgress,
  MediaUploadProps,
} from './media-upload.types';
import {
  createMediaUploadItem,
  clampMediaUploadItems,
  createLocalUploadTrackingId,
  normalizeExternalMediaUrl,
  readDefaultAlt,
  readExternalUrlPlaceholder,
  readMediaUploadErrorMessage,
  resolveImportedMediaType,
} from './media-upload.utils';
import {
  MediaUploadCloudPickersSection,
  MediaUploadDeviceSection,
  MediaUploadExternalLinkSection,
  MediaUploadPickerStatusSection,
  MediaUploadPreviewGrid,
} from './media-upload.sections';

export function MediaUpload({
  disabled = false,
  error,
  maxItems = 12,
  onChange,
  onUploadFiles,
  value,
}: Readonly<MediaUploadProps>): ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [externalAlt, setExternalAlt] = useState('');
  const [externalProvider, setExternalProvider] = useState<ExternalMediaProvider>('direct-url');
  const [externalType, setExternalType] = useState<SupportedMediaType>('image');
  const [externalUrl, setExternalUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadingItems, setUploadingItems] = useState<readonly MediaUploadItem[]>([]);

  const remainingSlots = Math.max(0, maxItems - value.length);
  const acceptedFileTypes = useMemo(() => buildMediaInputAcceptAttribute(), []);
  const displayError = localError ?? error;
  const externalUrlPlaceholder = readExternalUrlPlaceholder(externalProvider);
  const googlePickerAvailability = useMemo(() => readGooglePickerAvailability(), []);
  const dropboxPickerAvailability = useMemo(() => readDropboxPickerAvailability(), []);
  const providerStatuses = useMemo(
    () => [
      {
        configured: true,
        hint: 'Always available through drag and drop or file selection.',
        label: 'Device upload',
      },
      {
        configured: true,
        hint: 'Paste a public image or video URL directly into the form.',
        label: 'Web link',
      },
      {
        ...googlePickerAvailability,
        hint: googlePickerAvailability.hint ?? 'Google Drive is not configured.',
        label: 'Google Drive',
      },
      {
        ...dropboxPickerAvailability,
        hint: dropboxPickerAvailability.hint ?? 'Dropbox is not configured.',
        label: 'Dropbox',
      },
    ],
    [dropboxPickerAvailability, googlePickerAvailability],
  );

  const updateItems = useCallback(
    (items: MediaUploadItem[]): void => {
      setLocalError(null);
      onChange(items);
    },
    [onChange],
  );

  const removeItem = useCallback(
    (itemId: string): void => {
      updateItems(value.filter((item) => item.id !== itemId));
    },
    [updateItems, value],
  );

  const updateAlt = useCallback(
    (itemId: string, alt: string): void => {
      updateItems(value.map((item) => (item.id === itemId ? { ...item, alt } : item)));
    },
    [updateItems, value],
  );

  const uploadFiles = useCallback(
    async (files: readonly File[]): Promise<void> => {
      if (disabled || files.length === 0) {
        return;
      }

      if (remainingSlots === 0) {
        setLocalError(`You can add up to ${maxItems} media items per listing.`);

        return;
      }

      const limitedFiles = files.slice(0, remainingSlots);
      const unsupportedFile = limitedFiles.find(
        (file) =>
          detectSupportedMediaType({
            fileNameOrUrl: file.name,
            mimeType: file.type,
          }) === undefined,
      );

      if (unsupportedFile) {
        setLocalError(`"${unsupportedFile.name}" is not an allowed image or video format.`);

        return;
      }

      setIsUploading(true);
      setLocalError(null);
      setUploadingItems(
        limitedFiles.map((file) =>
          createMediaUploadItem({
            alt: readDefaultAlt(file.name),
            id: createLocalUploadTrackingId(file),
            mimeType: file.type,
            originalName: file.name,
            progressPercent: 0,
            source: 'device',
            type:
              detectSupportedMediaType({
                fileNameOrUrl: file.name,
                mimeType: file.type,
              }) ?? 'image',
            url: '',
            uploadState: 'uploading',
          }),
        ),
      );

      try {
        const uploadedAssets = await onUploadFiles([...limitedFiles], {
          onProgress: (progress: Readonly<MediaUploadProgress>) => {
            setUploadingItems((currentItems) =>
              currentItems.map((item) =>
                item.id === progress.uploadId
                  ? {
                      ...item,
                      progressPercent: progress.percent,
                    }
                  : item,
              ),
            );
          },
        });
        const uploadedItems = uploadedAssets.map((asset) =>
          createMediaUploadItem({
            alt: readDefaultAlt(asset.originalName),
            id: asset.id,
            mimeType: asset.mimeType,
            originalName: asset.originalName,
            source: 'device',
            type: asset.type,
            url: asset.url,
            uploadState: 'uploaded',
          }),
        );

        updateItems(clampMediaUploadItems(value, uploadedItems, maxItems));
      } catch (uploadError) {
        setLocalError(readMediaUploadErrorMessage(uploadError));
      } finally {
        setIsUploading(false);
        setUploadingItems([]);
      }
    },
    [disabled, maxItems, onUploadFiles, remainingSlots, updateItems, value],
  );

  const handleFileSelection = useCallback(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const input = event.currentTarget;
      const files = input.files ? Array.from(input.files) : [];

      await uploadFiles(files);
      input.value = '';
    },
    [uploadFiles],
  );

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>): Promise<void> => {
      event.preventDefault();
      setIsDragging(false);

      await uploadFiles(Array.from(event.dataTransfer.files ?? []));
    },
    [uploadFiles],
  );

  const importFromGoogleDrive = useCallback(async (): Promise<void> => {
    if (disabled || remainingSlots === 0) {
      return;
    }

    const config = readGooglePickerConfig();
    if (!config) {
      setLocalError(readGooglePickerAvailability().hint ?? 'Google Drive is not configured.');

      return;
    }

    try {
      setLocalError(null);
      const files = await pickGoogleDriveFiles(config);
      await uploadFiles(files);
    } catch (providerError) {
      setLocalError(readMediaUploadErrorMessage(providerError));
    }
  }, [disabled, remainingSlots, uploadFiles]);

  const importFromDropbox = useCallback(async (): Promise<void> => {
    if (disabled || remainingSlots === 0) {
      return;
    }

    const config = readDropboxPickerConfig();
    if (!config) {
      setLocalError(readDropboxPickerAvailability().hint ?? 'Dropbox is not configured.');

      return;
    }

    try {
      setLocalError(null);
      const files = await pickDropboxFiles(config);
      await uploadFiles(files);
    } catch (providerError) {
      setLocalError(readMediaUploadErrorMessage(providerError));
    }
  }, [disabled, remainingSlots, uploadFiles]);

  const addExternalMedia = useCallback((): void => {
    if (disabled) {
      return;
    }

    if (remainingSlots === 0) {
      setLocalError(`You can add up to ${maxItems} media items per listing.`);

      return;
    }

    try {
      const normalizedUrl = normalizeExternalMediaUrl(externalProvider, externalUrl);
      const type = resolveImportedMediaType({
        preferredType: externalType,
        provider: externalProvider,
        url: externalUrl,
      });

      updateItems(
        clampMediaUploadItems(
          value,
          [
            createMediaUploadItem({
              alt: externalAlt.trim() || readDefaultAlt(externalUrl),
              source: externalProvider,
              type,
              url: normalizedUrl,
            }),
          ],
          maxItems,
        ),
      );
      setExternalAlt('');
      setExternalUrl('');
      setLocalError(null);
    } catch (providerError) {
      setLocalError(readMediaUploadErrorMessage(providerError));
    }
  }, [
    disabled,
    externalAlt,
    externalProvider,
    externalType,
    externalUrl,
    maxItems,
    remainingSlots,
    updateItems,
    value,
  ]);

  return (
    <div className="grid gap-4">
      <MediaUploadPickerStatusSection providerStatuses={providerStatuses} />
      <MediaUploadDeviceSection
        acceptedFileTypes={acceptedFileTypes}
        disabled={disabled}
        handleDrop={handleDrop}
        inputRef={inputRef}
        isDragging={isDragging}
        isUploading={isUploading}
        maxItems={maxItems}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onFileSelection={handleFileSelection}
        remainingSlots={remainingSlots}
        selectedCount={value.length}
      />
      <MediaUploadCloudPickersSection
        disabled={disabled}
        dropboxConfigured={dropboxPickerAvailability.configured}
        dropboxHint={dropboxPickerAvailability.hint ?? 'Dropbox is not configured.'}
        importFromDropbox={() => {
          void importFromDropbox();
        }}
        importFromGoogleDrive={() => {
          void importFromGoogleDrive();
        }}
        isUploading={isUploading}
        googleConfigured={googlePickerAvailability.configured}
        googleHint={googlePickerAvailability.hint ?? 'Google Drive is not configured.'}
        remainingSlots={remainingSlots}
      />
      <MediaUploadExternalLinkSection
        addExternalMedia={addExternalMedia}
        disabled={disabled}
        externalAlt={externalAlt}
        externalProvider={externalProvider}
        externalType={externalType}
        externalUrl={externalUrl}
        externalUrlPlaceholder={externalUrlPlaceholder}
        onExternalAltChange={setExternalAlt}
        onExternalProviderChange={setExternalProvider}
        onExternalTypeChange={setExternalType}
        onExternalUrlChange={setExternalUrl}
        remainingSlots={remainingSlots}
      />

      {displayError ? (
        <p className="rounded-md border bg-muted px-3 py-2 text-sm text-destructive">
          {displayError}
        </p>
      ) : null}

      <MediaUploadPreviewGrid
        disabled={disabled}
        removeItem={removeItem}
        updateAlt={updateAlt}
        uploadingItems={uploadingItems}
        value={value}
      />
    </div>
  );
}
