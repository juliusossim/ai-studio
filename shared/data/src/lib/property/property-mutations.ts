import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MediaAssetIntent } from '@org/types';
import { useRipplesApi } from '../api/api-provider';
import { feedQueryKey } from '../feed/feed-query';
import type {
  CreatePropertyMutationResult,
  PropertyInteractionMutationResult,
  UploadMediaMutationResult,
} from './property-mutations.types';

export function useCreatePropertyMutation(accessToken?: string): CreatePropertyMutationResult {
  const { client } = useRipplesApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => client.createProperty(input, accessToken),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feedQueryKey });
    },
  });
}

export function useUploadMediaMutation(
  intent: MediaAssetIntent,
  accessToken?: string,
): UploadMediaMutationResult {
  const { client } = useRipplesApi();

  return useMutation({
    mutationFn: ({ files, onProgress }) =>
      client.uploadMedia(files, accessToken, { intent, onProgress, source: 'device' }),
  });
}

export function usePropertyInteractionMutation(
  accessToken?: string,
): PropertyInteractionMutationResult {
  const { client } = useRipplesApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interaction, payload, propertyId }) => {
      if (interaction === 'like') {
        return client.likeProperty(propertyId, payload, accessToken);
      }
      if (interaction === 'save') {
        return client.saveProperty(propertyId, payload, accessToken);
      }
      if (interaction === 'share') {
        return client.shareProperty(propertyId, payload, accessToken);
      }

      return client.viewProperty(propertyId, payload, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feedQueryKey });
    },
  });
}
