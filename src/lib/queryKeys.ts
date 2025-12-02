/**
 * Centralized Query Keys
 * 
 * Benefits:
 * - Type-safe query key generation
 * - Consistent key structure across the app
 * - Easy invalidation and prefetching
 * - Hierarchical organization for smart cache updates
 */

export const queryKeys = {
    /**
     * Property-related query keys
     */
    properties: {
        all: ['properties'] as const,
        byUser: (userId: string) => ['properties', 'user', userId] as const,
        detail: (propertyId: string) => ['properties', 'detail', propertyId] as const,
    },

    /**
     * Rental-related query keys
     */
    rentals: {
        all: ['rentals'] as const,
        byUser: (userId: string) => ['rentals', 'user', userId] as const,
        detail: (rentalId: string) => ['rentals', 'detail', rentalId] as const,
    },

    /**
     * Tenant-related query keys (for future use)
     */
    tenants: {
        all: ['tenants'] as const,
        byRental: (rentalId: string) => ['tenants', 'rental', rentalId] as const,
        detail: (tenantId: string) => ['tenants', 'detail', tenantId] as const,
    },

    /**
     * Payment-related query keys (for future use)
     */
    payments: {
        all: ['payments'] as const,
        byTenant: (tenantId: string) => ['payments', 'tenant', tenantId] as const,
        byRental: (rentalId: string) => ['payments', 'rental', rentalId] as const,
        detail: (paymentId: string) => ['payments', 'detail', paymentId] as const,
    },

    /**
     * User-related query keys
     */
    user: {
        current: ['user', 'current'] as const,
    },
} as const;
