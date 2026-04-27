import { useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { useCreatePropertyMutation, useUploadMediaMutation } from '@org/data';
import { CreatePropertyForm, type CreatePropertyFormProps, useSession } from '@org/ui-web';

export default function DashboardListingsNewRoute(): ReactElement {
  const navigate = useNavigate();
  const { accessToken } = useSession();
  const createProperty = useCreatePropertyMutation(accessToken);
  const uploadMedia = useUploadMediaMutation('listing', accessToken);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formProps: CreatePropertyFormProps = {
    error: errorMessage ?? undefined,
    isSubmitting: createProperty.isPending,
    onUploadFiles: (files, options) =>
      uploadMedia.mutateAsync({ files, onProgress: options?.onProgress }),
    onSubmit: async (input) => {
      setErrorMessage(null);
      try {
        await createProperty.mutateAsync(input);
        void navigate('/dashboard/listings');
      } catch (submissionError) {
        setErrorMessage(readRouteError(submissionError));
      }
    },
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Dashboard
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">Create a new listing</h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          This is the first concrete publishing route in the new router. It moves property entry out
          of the feed sidebar and into the dashboard inventory workflow.
        </p>
      </header>
      <section className="rounded-[1.5rem] border bg-card p-6 shadow-sm">
        <CreatePropertyForm {...formProps} />
      </section>
    </section>
  );
}

function readRouteError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to create the listing right now.';
}
