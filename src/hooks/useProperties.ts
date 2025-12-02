import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@appwriteconfig/db';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to fetch properties for the current user
 * 
 * Features:
 * - Automatic caching (5min fresh, 10min retention)
 * - Refetches on window focus
 * - Only runs when user is authenticated
 * 
 * @returns Query result with properties data, loading state, and error state
 */
export function useProperties() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: queryKeys.properties.byUser(user?.$id || ''),
        queryFn: getProperties,

        // Only fetch when user is authenticated
        enabled: !!user?.$id,

        // Keep previous data while refetching (prevents flickering)
        placeholderData: (previousData) => previousData,
    });
}
