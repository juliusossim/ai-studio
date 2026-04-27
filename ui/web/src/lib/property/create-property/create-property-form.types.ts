import type { MediaUploadItem } from '@org/ui-media-upload';
import type {
  CreatePropertyRequest,
  MediaUploadProgressListener,
  UploadedMediaAsset,
} from '@org/types';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreatePropertyFormInput } from './create-property-form.schema';

export interface CreatePropertyFormProps {
  readonly disabled?: boolean;
  readonly error?: string;
  readonly isSubmitting: boolean;
  readonly onUploadFiles: (
    files: File[],
    options?: {
      readonly onProgress?: MediaUploadProgressListener;
    },
  ) => Promise<readonly UploadedMediaAsset[]>;
  readonly onSubmit: (input: CreatePropertyRequest) => Promise<void>;
}

export interface CreatePropertyFormFieldsProps {
  readonly errors: FieldErrors<CreatePropertyFormInput>;
  readonly register: UseFormRegister<CreatePropertyFormInput>;
}

export interface CreatePropertyMediaFieldsProps {
  readonly disabled?: boolean;
  readonly error?: string;
  readonly media: readonly MediaUploadItem[];
  readonly onChange: (items: MediaUploadItem[]) => void;
  readonly onUploadFiles: (
    files: File[],
    options?: {
      readonly onProgress?: MediaUploadProgressListener;
    },
  ) => Promise<readonly UploadedMediaAsset[]>;
}
