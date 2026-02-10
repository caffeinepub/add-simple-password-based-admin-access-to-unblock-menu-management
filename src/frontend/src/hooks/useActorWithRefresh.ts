import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Extended version of useActor that adds refresh capability and error exposure
 * for admin authentication flows
 */
export function useActorWithRefresh() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  // Refresh action to force actor recreation
  const refreshActor = useCallback(() => {
    // Invalidate the actor query to force recreation
    queryClient.invalidateQueries({ 
      predicate: (query) => query.queryKey.includes('actor')
    });
  }, [queryClient]);

  return {
    actor,
    isFetching,
    refreshActor,
  };
}
