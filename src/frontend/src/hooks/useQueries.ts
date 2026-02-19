import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Title, TitleInput, UserProfile, UserRole } from '../backend';

export function useGetAllTitles() {
  const { actor, isFetching } = useActor();

  return useQuery<Title[]>({
    queryKey: ['titles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTitles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTitleById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Title>({
    queryKey: ['title', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTitleById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchTitles(search: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Title[]>({
    queryKey: ['search', search],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchTitles(search);
    },
    enabled: !!actor && !isFetching && search.trim().length > 0,
  });
}

export function useGetTitleRatings(titleId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<{ averageRating: number; ratingCount: bigint } | null>({
    queryKey: ['ratings', titleId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTitleRatings(titleId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TitleInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTitle(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
    },
  });
}

export function useDeleteTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTitle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
    },
  });
}

export function useRateTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ titleId, userRating }: { titleId: bigint; userRating: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rateTitle(titleId, userRating);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', variables.titleId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['title', variables.titleId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['titles'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
