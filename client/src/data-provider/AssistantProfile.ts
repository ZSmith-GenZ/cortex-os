import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { dataService } from 'librechat-data-provider';

export type AssistantProfile = {
  name: string;
  personality: string;
  avatar: string | null;
};

const ASSISTANT_PROFILE_KEY = ['assistantProfile'];

export const useGetAssistantProfile = (
  config?: Omit<UseQueryOptions<AssistantProfile, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<AssistantProfile, Error>(
    ASSISTANT_PROFILE_KEY,
    () => dataService.getAssistantProfile(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useUpdateAssistantProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (profile: Partial<AssistantProfile>) => dataService.updateAssistantProfile(profile),
    {
      onMutate: async (newProfile) => {
        await queryClient.cancelQueries(ASSISTANT_PROFILE_KEY);
        const previous = queryClient.getQueryData<AssistantProfile>(ASSISTANT_PROFILE_KEY);
        if (previous) {
          queryClient.setQueryData(ASSISTANT_PROFILE_KEY, { ...previous, ...newProfile });
        }
        return { previous };
      },
      onError: (_err, _newProfile, context) => {
        if (context?.previous) {
          queryClient.setQueryData(ASSISTANT_PROFILE_KEY, context.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(ASSISTANT_PROFILE_KEY);
      },
    },
  );
};
