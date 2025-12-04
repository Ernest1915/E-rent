import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperties } from '@appwriteconfig/db';
import type { Property } from '@appwriteconfig/index';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to create a new property with optimistic updates
 * 
 * Features:
 * - Instant UI feedback (optimistic update)
 * - Automatic rollback on error
 * - Cache invalidation on success
 * 
 * @returns Mutation object with mutate function and status
 */
export function useCreateProperty() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (data: { property_name: string; location: string }) =>
            createProperties(data),

        // OPTIMISTIC UPDATE: Update UI immediately before server responds
        onMutate: async (newProperty) => {
            // Cancel any outgoing refetches to prevent overwriting optimistic update
            await queryClient.cancelQueries({
                queryKey: queryKeys.properties.byUser(user?.$id || '')
            });

            // Snapshot the previous value for rollback
            const previousProperties = queryClient.getQueryData<Property[]>(
                queryKeys.properties.byUser(user?.$id || '')
            );

            // Optimistically update the cache with temporary data
            queryClient.setQueryData<Property[]>(
                queryKeys.properties.byUser(user?.$id || ''),
                (old = []) => [
                    {
                        $id: `temp-${Date.now()}`,
                        'property_name': newProperty.property_name,
                        'location': newProperty.location,
                        'users': user?.$id || '',
                        $createdAt: new Date().toISOString(),
                        $updatedAt: new Date().toISOString(),
                        $permissions: [],
                        $collectionId: '',
                        $databaseId: '',
                    } as Property,
                    ...old,
                ]
            );

            // Return context for rollback
            return { previousProperties };
        },

        // ROLLBACK: Restore previous state if mutation fails
        onError: (err, _variables, context) => {
            console.error('❌ Property creation FAILED:', err);
            console.error('Error details:', {
                message: err?.message,
                name: err?.name,
                stack: err?.stack
            });

            if (context?.previousProperties) {
                queryClient.setQueryData(
                    queryKeys.properties.byUser(user?.$id || ''),
                    context.previousProperties
                );
            }
        },

        // SYNC: Refetch to get the real data from server (only on success)
        onSuccess: (data) => {
            console.log('✅ Property created successfully:', data);
            console.log('Invalidating cache to refresh...');

            queryClient.invalidateQueries({
                queryKey: queryKeys.properties.byUser(user?.$id || '')
            });
        },

        // SETTLED: Called after either success or error
        onSettled: () => {
            console.log('🏁 Mutation settled (completed)');
        }
    });
}
