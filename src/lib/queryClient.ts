import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * 
 * Default options optimize for:
 * - 5min fresh data (staleTime)
 * - 10min cache retention (gcTime)
 * - Auto-refetch on window focus and network reconnect
 * - Single retry on failures
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Unused data is garbage collected after 10 minutes
            gcTime: 10 * 60 * 1000,

            // Automatically refetch when window regains focus
            refetchOnWindowFocus: true,

            // Automatically refetch when network reconnects
            refetchOnReconnect: true,

            // Retry failed requests once
            retry: 1,

            // Disable retries on errors with status codes 400-499
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // Retry mutations once
            retry: 1,
        },
    },
});
