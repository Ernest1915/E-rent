import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProperty, type Property } from '@appwriteconfig/db';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to delete a property with optimistic updates
 * 
 * Features:
 * - Instant UI removal (optimistic update)
 * - Automatic rollback on error
 * - Cache invalidation on success
 * 
 * @returns Mutation object with mutate function and status
 */
export function useDeleteProperty() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (propertyId: string) => deleteProperty(propertyId),

        // OPTIMISTIC UPDATE: Remove from UI immediately
        onMutate: async (propertyId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: queryKeys.properties.byUser(user?.$id || '')
            });

            // Snapshot the previous value for rollback
            const previousProperties = queryClient.getQueryData<Property[]>(
                queryKeys.properties.byUser(user?.$id || '')
            );

            // Optimistically remove the property from cache
            queryClient.setQueryData<Property[]>(
                queryKeys.properties.byUser(user?.$id || ''),
                (old = []) => old.filter(property => property.$id !== propertyId)
            );

            // Return context for rollback
            return { previousProperties };
        },

        // ROLLBACK: Restore previous state if deletion fails
        onError: (err, _variables, context) => {
            console.error('Failed to delete property:', err);

            if (context?.previousProperties) {
                queryClient.setQueryData(
                    queryKeys.properties.byUser(user?.$id || ''),
                    context.previousProperties
                );
            }
        },

        // SYNC: Refetch to ensure cache is in sync
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.properties.byUser(user?.$id || '')
            });
        },
    });
}
