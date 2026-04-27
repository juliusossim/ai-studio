import type { PropertyInteractionMutationInput, PropertyInteractionName } from '@org/data';
import type { CreatePropertyRequest } from '@org/types';

export async function publishFeedProperty(input: {
  readonly createProperty: {
    mutateAsync: (value: CreatePropertyRequest) => Promise<unknown>;
  };
  readonly createPropertyInput: CreatePropertyRequest;
  readonly onError: (message: string) => void;
  readonly readErrorMessage: (error: unknown) => string;
  readonly resetError: () => void;
}): Promise<void> {
  input.resetError();

  try {
    await input.createProperty.mutateAsync(input.createPropertyInput);
  } catch (error) {
    input.onError(input.readErrorMessage(error));
  }
}

export function trackFeedPropertyInteraction(input: {
  readonly interaction: PropertyInteractionName;
  readonly mutate: (value: PropertyInteractionMutationInput) => void;
  readonly propertyId: string;
  readonly sessionId: string;
  readonly userId?: string;
}): void {
  input.mutate({
    propertyId: input.propertyId,
    interaction: input.interaction,
    payload: {
      sessionId: input.sessionId,
      userId: input.userId,
    },
  });
}
