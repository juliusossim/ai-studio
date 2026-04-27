import { Badge, Button, Card, Input, MediaRenderer, cn } from '@org/ui-primitives';
import type { SupportedMediaType } from '@org/utils';
import type { ChangeEvent, DragEvent, ReactElement, RefObject } from 'react';
import type { ExternalMediaProvider, MediaUploadItem } from './media-upload.types';
import { externalMediaProviders, readAvailabilityBadgeVariant } from './media-upload.utils';

interface ProviderStatus {
  readonly configured: boolean;
  readonly hint: string;
  readonly label: string;
}

export function MediaUploadPickerStatusSection({
  providerStatuses,
}: Readonly<{
  providerStatuses: readonly ProviderStatus[];
}>): ReactElement {
  return (
    <Card className="grid gap-4 p-4">
      <div className="space-y-1">
        <p className="font-medium text-foreground">Picker status</p>
        <p className="text-sm text-muted-foreground">
          Quick environment check for every media source available in this composer.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {providerStatuses.map((provider) => (
          <div className="rounded-xl border border-border bg-muted/20 p-3" key={provider.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{provider.label}</p>
              <Badge variant={readAvailabilityBadgeVariant(provider.configured)}>
                {provider.configured ? 'Ready' : 'Setup needed'}
              </Badge>
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">{provider.hint}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MediaUploadDeviceSection({
  acceptedFileTypes,
  disabled,
  handleDrop,
  inputRef,
  isDragging,
  isUploading,
  maxItems,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onFileSelection,
  remainingSlots,
  selectedCount,
}: Readonly<{
  acceptedFileTypes: string;
  disabled: boolean;
  handleDrop: (event: DragEvent<HTMLDivElement>) => Promise<void>;
  inputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isUploading: boolean;
  maxItems: number;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelection: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  remainingSlots: number;
  selectedCount: number;
}>): ReactElement {
  return (
    <Card
      className={cn(
        'border-dashed p-4 transition-colors',
        isDragging ? 'border-amber-400 bg-amber-50/50' : 'border-border',
        disabled ? 'opacity-60' : '',
      )}
    >
      <div
        className="grid gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-center"
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        <div className="space-y-1">
          <p className="font-medium text-foreground">Drag media here or choose from device</p>
          <p className="text-sm text-muted-foreground">
            Supports up to {maxItems} items across images and videos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            disabled={disabled || isUploading || remainingSlots === 0}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {isUploading ? 'Uploading...' : 'Choose files'}
          </Button>
          <Badge variant="secondary">
            {selectedCount}/{maxItems} selected
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          Allowed formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF, MP4, WebM, OGG,
          MOV, AVI, MKV, MPEG, 3GP, and M4V.
        </p>

        <input
          ref={inputRef}
          accept={acceptedFileTypes}
          className="hidden"
          disabled={disabled}
          multiple
          onChange={onFileSelection}
          type="file"
        />
      </div>
    </Card>
  );
}

export function MediaUploadCloudPickersSection({
  disabled,
  dropboxConfigured,
  dropboxHint,
  importFromDropbox,
  importFromGoogleDrive,
  isUploading,
  googleConfigured,
  googleHint,
  remainingSlots,
}: Readonly<{
  disabled: boolean;
  dropboxConfigured: boolean;
  dropboxHint: string;
  importFromDropbox: () => void;
  importFromGoogleDrive: () => void;
  isUploading: boolean;
  googleConfigured: boolean;
  googleHint: string;
  remainingSlots: number;
}>): ReactElement {
  return (
    <Card className="grid gap-4 p-4">
      <div className="space-y-1">
        <p className="font-medium text-foreground">Cloud pickers</p>
        <p className="text-sm text-muted-foreground">
          Browse Google Drive or Dropbox, then upload the selected assets into Ripples.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          disabled={disabled || isUploading || remainingSlots === 0 || !googleConfigured}
          onClick={importFromGoogleDrive}
          type="button"
          variant="outline"
        >
          Browse Google Drive
        </Button>
        <Button
          disabled={disabled || isUploading || remainingSlots === 0 || !dropboxConfigured}
          onClick={importFromDropbox}
          type="button"
          variant="outline"
        >
          Browse Dropbox
        </Button>
      </div>

      {googleConfigured && dropboxConfigured ? null : (
        <div className="grid gap-2 text-xs text-muted-foreground">
          {googleConfigured ? null : <p>{googleHint}</p>}
          {dropboxConfigured ? null : <p>{dropboxHint}</p>}
        </div>
      )}
    </Card>
  );
}

export function MediaUploadExternalLinkSection({
  addExternalMedia,
  disabled,
  externalAlt,
  externalProvider,
  externalType,
  externalUrl,
  externalUrlPlaceholder,
  onExternalAltChange,
  onExternalProviderChange,
  onExternalTypeChange,
  onExternalUrlChange,
  remainingSlots,
}: Readonly<{
  addExternalMedia: () => void;
  disabled: boolean;
  externalAlt: string;
  externalProvider: ExternalMediaProvider;
  externalType: SupportedMediaType;
  externalUrl: string;
  externalUrlPlaceholder: string;
  onExternalAltChange: (value: string) => void;
  onExternalProviderChange: (provider: ExternalMediaProvider) => void;
  onExternalTypeChange: (value: SupportedMediaType) => void;
  onExternalUrlChange: (value: string) => void;
  remainingSlots: number;
}>): ReactElement {
  return (
    <Card className="grid gap-4 p-4">
      <div className="space-y-1">
        <p className="font-medium text-foreground">Import from shared links</p>
        <p className="text-sm text-muted-foreground">
          Add Dropbox or Google Drive media by pasting a public file link.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {externalMediaProviders.map((provider) => (
          <Button
            className="h-auto justify-start px-4 py-3 text-left"
            disabled={disabled}
            key={provider.value}
            onClick={() => onExternalProviderChange(provider.value)}
            variant={externalProvider === provider.value ? 'default' : 'outline'}
          >
            <span className="block">
              <span className="block font-medium">{provider.label}</span>
              <span className="mt-1 block text-xs leading-5 opacity-80">
                {provider.description}
              </span>
            </span>
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Input
          aria-label="Media link"
          disabled={disabled}
          onChange={(event) => onExternalUrlChange(event.currentTarget.value)}
          placeholder={externalUrlPlaceholder}
          type="url"
          value={externalUrl}
        />
        <Input
          aria-label="Media alt text"
          disabled={disabled}
          onChange={(event) => onExternalAltChange(event.currentTarget.value)}
          placeholder="Describe the media"
          value={externalAlt}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="media-upload-type">
          Media type
        </label>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          disabled={disabled}
          id="media-upload-type"
          onChange={(event) =>
            onExternalTypeChange(event.currentTarget.value as SupportedMediaType)
          }
          value={externalType}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <Button
          disabled={disabled || !externalUrl.trim() || remainingSlots === 0}
          onClick={addExternalMedia}
          type="button"
          variant="outline"
        >
          Add media link
        </Button>
      </div>
    </Card>
  );
}

export function MediaUploadPreviewGrid({
  disabled,
  removeItem,
  updateAlt,
  uploadingItems,
  value,
}: Readonly<{
  disabled: boolean;
  removeItem: (itemId: string) => void;
  updateAlt: (itemId: string, alt: string) => void;
  uploadingItems: readonly MediaUploadItem[];
  value: readonly MediaUploadItem[];
}>): ReactElement {
  if (value.length === 0 && uploadingItems.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
        Add images or videos to preview the listing media.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {uploadingItems.map((item) => (
        <Card className="grid gap-3 p-3" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {item.originalName ?? 'Uploading media'}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploading directly to secure media storage
              </p>
            </div>
            <Badge variant="secondary">{`${item.progressPercent ?? 0}%`}</Badge>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground transition-[width] duration-200"
              style={{ width: `${item.progressPercent ?? 0}%` }}
            />
          </div>
        </Card>
      ))}
      {value.map((item) => (
        <Card className="grid gap-3 p-3" key={item.id}>
          <div className="overflow-hidden rounded-xl">
            <MediaRenderer
              alt={item.alt}
              className="aspect-[4/3] bg-muted"
              mediaClassName="w-full"
              muted
              objectFit="cover"
              showControls={item.type === 'video'}
              source={{
                mimeType: item.mimeType,
                url: item.url,
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{item.type}</Badge>
            <Badge variant="secondary">{item.source}</Badge>
          </div>

          <Input
            aria-label={`Alt text for ${item.url}`}
            disabled={disabled}
            onChange={(event) => updateAlt(item.id, event.currentTarget.value)}
            placeholder="Describe this media"
            value={item.alt}
          />

          <div className="flex justify-end">
            <Button
              disabled={disabled}
              onClick={() => removeItem(item.id)}
              type="button"
              variant="outline"
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
