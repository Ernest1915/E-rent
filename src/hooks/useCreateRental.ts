import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRental, type Rental } from '@appwriteconfig/db';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to create a new rental with optimistic updates
 * 
 * Features:
 * - Instant UI feedback (optimistic update)
 * - Automatic rollback on error
 * - Cache invalidation on success
 * 
 * @returns Mutation object with mutate function and status
 */
export function useCreateRental() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (data: { unitId: string; unitStatus: string }) =>
            createRental(data),

        // OPTIMISTIC UPDATE: Update UI immediately before server responds
        onMutate: async (newRental) => {
            // Cancel any outgoing refetches to prevent overwriting optimistic update
            await queryClient.cancelQueries({
                queryKey: queryKeys.rentals.byUser(user?.$id || '')
            });

            // Snapshot the previous value for rollback
            const previousRentals = queryClient.getQueryData<Rental[]>(
                queryKeys.rentals.byUser(user?.$id || '')
            );

            // Optimistically update the cache with temporary data
            queryClient.setQueryData<Rental[]>(
                queryKeys.rentals.byUser(user?.$id || ''),
                (old = []) => [
                    {
                        $id: `temp-${Date.now()}`,
                        'unit-id': newRental.unitId,
                        'unit-status': newRental.unitStatus,
                        $createdAt: new Date().toISOString(),
                        $updatedAt: new Date().toISOString(),
                        $permissions: [],
                        $collectionId: '',
                        $databaseId: '',
                    } as Rental,
                    ...old,
                ]
            );

            // Return context for rollback
            return { previousRentals };
        },

        // ROLLBACK: Restore previous state if mutation fails
        onError: (err, _variables, context) => {
            console.error('Failed to create rental:', err);

            if (context?.previousRentals) {
                queryClient.setQueryData(
                    queryKeys.rentals.byUser(user?.$id || ''),
                    context.previousRentals
                );
            }
        },

        // SYNC: Refetch to get the real data from server
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.rentals.byUser(user?.$id || '')
            });
        },
    });
}
