import { useUploadMediaMutation } from '@org/data';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { CreatePropertyForm } from '../../property/create-property/create-property-form';
import type { FeedCreatePanelProps } from './feed-create-panel.types';

export function FeedCreatePanel({
  accessToken,
  isCreatingProperty,
  onPropertySubmit,
  propertyError,
  title,
}: Readonly<FeedCreatePanelProps>): ReactElement {
  const uploadMedia = useUploadMediaMutation('listing', accessToken);

  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          Phase 1
        </Badge>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Publish canonical property listings with price, location, and media.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreatePropertyForm
          disabled={!accessToken}
          error={propertyError}
          isSubmitting={isCreatingProperty}
          onUploadFiles={(files, options) =>
            uploadMedia.mutateAsync({ files, onProgress: options?.onProgress })
          }
          onSubmit={onPropertySubmit}
        />
      </CardContent>
    </Card>
  );
}
