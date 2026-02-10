import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CategoryId, FoodItemId, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// Category Mutations
export function useAddCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, order }: { name: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCategory(name, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: CategoryId; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateCategory(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useToggleCategoryEnabled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, enabled }: { id: CategoryId; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleCategoryEnabled(id, enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: CategoryId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useReorderCategories() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: CategoryId[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderCategories(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Food Item Mutations
export function useAddFoodItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      hot,
      categoryId,
      order,
    }: {
      name: string;
      description: string;
      price: number;
      hot: boolean;
      categoryId: CategoryId;
      order: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFoodItem(name, description, price, hot, categoryId, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateFoodItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      hot,
      categoryId,
    }: {
      id: FoodItemId;
      name: string;
      description: string;
      price: number;
      hot: boolean;
      categoryId: CategoryId;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFoodItem(id, name, description, price, hot, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
    },
  });
}

export function useUpdateFoodItemImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, image }: { id: FoodItemId; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFoodItemImage(id, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
    },
  });
}

export function useToggleFoodItemEnabled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, enabled }: { id: FoodItemId; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleFoodItemEnabled(id, enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteFoodItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: FoodItemId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteFoodItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useReorderFoodItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: FoodItemId[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderFoodItems(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
    },
  });
}
