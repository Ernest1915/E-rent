import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRental, type Rental } from '@appwriteconfig/db';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to delete a rental with optimistic updates
 * 
 * Features:
 * - Instant UI feedback (optimistic removal)
 * - Automatic rollback on error
 * - Cache invalidation on success
 * 
 * @returns Mutation object with mutate function and status
 */
export function useDeleteRental() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (rentalId: string) => deleteRental(rentalId),

        // OPTIMISTIC UPDATE: Remove from UI immediately
        onMutate: async (rentalId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: queryKeys.rentals.byUser(user?.$id || '')
            });

            // Snapshot previous value
            const previousRentals = queryClient.getQueryData<Rental[]>(
                queryKeys.rentals.byUser(user?.$id || '')
            );

            // Optimistically remove the rental from cache
            queryClient.setQueryData<Rental[]>(
                queryKeys.rentals.byUser(user?.$id || ''),
                (old = []) => old.filter(rental => rental.$id !== rentalId)
            );

            // Return context for rollback
            return { previousRentals };
        },

        // ROLLBACK: Restore if deletion fails
        onError: (err, _variables, context) => {
            console.error('Failed to delete rental:', err);

            if (context?.previousRentals) {
                queryClient.setQueryData(
                    queryKeys.rentals.byUser(user?.$id || ''),
                    context.previousRentals
                );
            }
        },

        // SYNC: Refetch to confirm server state
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.rentals.byUser(user?.$id || '')
            });
        },
    });
}
