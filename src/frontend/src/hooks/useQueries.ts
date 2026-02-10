import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category, FoodItem, AnalyticsData, UserProfile, CategoryId, FoodItemId, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Categories
export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      const categories = await actor.getCategories();
      return categories.sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

// Food Items
export function useGetAllFoodItems() {
  const { actor, isFetching } = useActor();

  return useQuery<FoodItem[]>({
    queryKey: ['foodItems'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllFoodItems();
      return items.sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFoodItemsForCategory(categoryId: CategoryId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FoodItem[]>({
    queryKey: ['foodItems', categoryId],
    queryFn: async () => {
      if (!actor || !categoryId) return [];
      const items = await actor.getFoodItemsForCategory(categoryId);
      return items.sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching && !!categoryId,
  });
}

// Analytics
export function useGetAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Profile - with explicit enable control for admin guard
export function useGetCallerUserProfile(options?: { enabled?: boolean }) {
  const { actor, isFetching: actorFetching } = useActor();
  const shouldFetch = options?.enabled !== false;

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        // If authorization error, return null instead of throwing
        // This allows admins to access admin panel without profile
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('permission')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && shouldFetch,
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
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
