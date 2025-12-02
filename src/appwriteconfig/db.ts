
import { account, databases, uniqueId, Query } from "../appwriteconfig/config";
import type { Rental, Property, UnitType, Tenant, Payment } from "../appwriteconfig/index";
export type { Rental, Property, UnitType, Tenant, Payment };

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const RENTAL_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RENTAL_COLLECTION_ID;
const TENANT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TENANT_COLLECTION_ID;
const PAYMENT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_COLLECTION_ID;
const PROPERTIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROPERTIES_COLLECTION_ID;
const UNIT_TYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_UNIT_TYPES_COLLECTION_ID;







/* -------------------------------------------------------
   GET RENTALS (only rows the user can read)
-------------------------------------------------------- */
export const getRentals = async (): Promise<Rental[]> => {
    try {
        const user = await account.get();


        const response = await databases.listDocuments<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            [Query.equal("users_id", user.$id)]
        );

        return response.documents;
    } catch (error) {
        console.error("Failed to fetch rentals:", error);
        throw error;
    }
};

/* -------------------------------------------------------
   CREATE RENTAL (with proper row-level permissions)
-------------------------------------------------------- */
export const createRental = async (data: {
    unitId: string;
    unitStatus: string;
    typeId: string; // this is the selected unit-type document ID
    tenant_id: string
}): Promise<Rental> => {
    try {
        const user = await account.get();

        const response = await databases.createDocument<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            uniqueId.unique(), // document ID
            {
                "unit-id": data.unitId,           // Appwrite field
                "unit-status": data.unitStatus,   // Appwrite field
                "users_id": user.$id,             // linked user ID
                "type_id": data.typeId,          // link to unit type
                "tenant_id": data.tenant_id
            }
        );

        return response;
    } catch (error) {
        console.error("Failed to create rental:", error);
        throw error;
    }
};


/* -------------------------------------------------------
   DELETE RENTAL (Appwrite handles permission checks)
-------------------------------------------------------- */
export const deleteRental = async (documentId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            documentId
        );
    } catch (error) {
        console.error("Failed to delete rental:", error);
        throw error;
    }
};
export const createProperties = async (data: {
    property_name: string;
    location: string;
}): Promise<Property> => {
    try {
        const user = await account.get();
        const response = await databases.createDocument<Property>(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            uniqueId.unique(), // document ID
            {
                "property_name": data.property_name,
                "location": data.location,
                "users_id": user.$id,
            }
        );
        return response;
    } catch (error) {
        console.error("Failed to create property:", error);
        throw error;
    }
};
export const getProperties = async (): Promise<Property[]> => {
    try {
        const user = await account.get();
        const response = await databases.listDocuments<Property>(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            [Query.equal("users_id", user.$id)]
        );

        return response.documents;
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        throw error;
    }
};
export const deleteProperty = async (documentId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            documentId

        )
    } catch (error) {
        console.error("Failed to delete rental:", error);
        throw error;
    }

}
export const createType = async (data: {
    name: string;
    rent: number;
    property_id: string;
    count: number;
}): Promise<UnitType> => {
    try {
        const response = await databases.createDocument<UnitType>(
            DATABASE_ID,
            UNIT_TYPES_COLLECTION_ID,
            uniqueId.unique(),
            {
                name: data.name,        // <-- Added missing comma before
                rent: data.rent,
                property_id: data.property_id,
                count: data.count
            }
        );

        return response;

    } catch (error) {
        console.error("Error creating type:", error);
        throw error; // optional but recommended
    }
}
export const getUnitTypes = async (property_id: string): Promise<UnitType[]> => {
    try {

        const response = await databases.listDocuments<UnitType>(
            DATABASE_ID,
            UNIT_TYPES_COLLECTION_ID,
            [Query.equal("property_id", property_id)]
        );
        return response.documents;
    } catch (error) {
        console.error("Failed to fetch unit types:", error);
        throw error;
    }
};

export const deleteUnitType = async (documentId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            UNIT_TYPES_COLLECTION_ID,
            documentId
        );
    } catch (error) {
        console.error("Failed to delete unit type:", error);
        throw error;
    }
};

/* -------------------------------------------------------
   TENANT MANAGEMENT
-------------------------------------------------------- */

/**
 * Create a new tenant
 */
export const createTenant = async (data: {
    name: string;
    contact: string;
    start_date: string;
}): Promise<Tenant> => {
    try {
        const response = await databases.createDocument<Tenant>(
            DATABASE_ID,
            TENANT_COLLECTION_ID,
            uniqueId.unique(),
            {
                name: data.name,
                contact: data.contact,
                start_date: data.start_date
            }
        );

        return response;
    } catch (error) {
        console.error("Failed to create tenant:", error);
        throw error;
    }
};

/**
 * Get all tenants (across all rentals accessible to the user)
 * Note: This fetches via rentals since tenants aren't directly linked to users
 */
export const getTenants = async (): Promise<Tenant[]> => {
    try {
        // Get all rentals for the user
        const rentals = await getRentals();

        // Extract unique tenant IDs
        const tenantIds = [...new Set(rentals.map(r => r.tenant_id))];

        // Fetch all tenants in parallel
        const tenants = await Promise.all(
            tenantIds.map(id =>
                databases.getDocument<Tenant>(
                    DATABASE_ID,
                    TENANT_COLLECTION_ID,
                    id
                )
            )
        );

        return tenants;
    } catch (error) {
        console.error("Failed to fetch tenants:", error);
        throw error;
    }
};

/**
 * Get a single tenant by ID
 */
export const getTenant = async (tenantId: string): Promise<Tenant> => {
    try {
        const response = await databases.getDocument<Tenant>(
            DATABASE_ID,
            TENANT_COLLECTION_ID,
            tenantId
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch tenant:", error);
        throw error;
    }
};

/**
 * Update tenant information
 */
export const updateTenant = async (
    tenantId: string,
    data: Partial<{
        name: string;
        contact: string;
        start_date: string;
    }>
): Promise<Tenant> => {
    try {
        const response = await databases.updateDocument<Tenant>(
            DATABASE_ID,
            TENANT_COLLECTION_ID,
            tenantId,
            data
        );
        return response;
    } catch (error) {
        console.error("Failed to update tenant:", error);
        throw error;
    }
};

/**
 * Delete a tenant
 */
export const deleteTenant = async (tenantId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            TENANT_COLLECTION_ID,
            tenantId
        );
    } catch (error) {
        console.error("Failed to delete tenant:", error);
        throw error;
    }
};

/* -------------------------------------------------------
   RENTAL ASSIGNMENT & MANAGEMENT
-------------------------------------------------------- */

/**
 * Assign a tenant to a unit (creates a Rental instance)
 */
export const assignTenantToUnit = async (data: {
    unitId: string;      // e.g., "1A", "2B" - physical unit identifier
    typeId: string;      // UnitType document ID
    tenantId: string;    // Tenant document ID
    unitStatus?: string; // Optional, defaults to "occupied"
}): Promise<Rental> => {
    try {
        const user = await account.get();

        // Create the rental instance
        const response = await databases.createDocument<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            uniqueId.unique(),
            {
                "unit-id": data.unitId,
                "unit-status": data.unitStatus || "occupied",
                "users_id": user.$id,
                "type_id": data.typeId,
                "tenant_id": data.tenantId
            }
        );

        return response;
    } catch (error) {
        console.error("Failed to assign tenant to unit:", error);
        throw error;
    }
};

/**
 * Update a rental (e.g., change status, reassign unit)
 */
export const updateRental = async (
    rentalId: string,
    data: Partial<{
        unitId: string;
        unitStatus: string;
        typeId: string;
        tenantId: string;
    }>
): Promise<Rental> => {
    try {
        // Map camelCase to Appwrite field names
        const updateData: Record<string, string> = {};
        if (data.unitId !== undefined) updateData["unit-id"] = data.unitId;
        if (data.unitStatus !== undefined) updateData["unit-status"] = data.unitStatus;
        if (data.typeId !== undefined) updateData["type_id"] = data.typeId;
        if (data.tenantId !== undefined) updateData["tenant_id"] = data.tenantId;

        const response = await databases.updateDocument<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            rentalId,
            updateData
        );

        return response;
    } catch (error) {
        console.error("Failed to update rental:", error);
        throw error;
    }
};

/**
 * Terminate a rental (sets status to terminated)
 */
export const terminateRental = async (rentalId: string): Promise<Rental> => {
    return updateRental(rentalId, { unitStatus: "terminated" });
};

/* -------------------------------------------------------
   RENTAL QUERIES & HELPERS
-------------------------------------------------------- */

/**
 * Get all rentals for a specific property
 */
export const getRentalsByProperty = async (propertyId: string): Promise<Rental[]> => {
    try {
        // First get all unit types for this property
        const unitTypes = await getUnitTypes(propertyId);
        const typeIds = unitTypes.map(ut => ut.$id);

        // Then get all rentals that match these types
        const rentals = await getRentals();

        // Filter rentals by type_id
        return rentals.filter(rental => typeIds.includes(rental.type_id));
    } catch (error) {
        console.error("Failed to fetch rentals by property:", error);
        throw error;
    }
};

/**
 * Get occupied units count for a specific unit type
 */
export const getOccupiedUnitsCount = async (typeId: string): Promise<number> => {
    try {
        const rentals = await getRentals();

        // Count rentals with this type_id and status "occupied"
        return rentals.filter(
            r => r.type_id === typeId && r["unit-status"] === "occupied"
        ).length;
    } catch (error) {
        console.error("Failed to get occupied units count:", error);
        throw error;
    }
};

/**
 * Get available units count for a specific unit type
 */
export const getAvailableUnitsCount = async (typeId: string): Promise<number> => {
    try {
        // Get the unit type to know total count
        const unitType = await databases.getDocument<UnitType>(
            DATABASE_ID,
            UNIT_TYPES_COLLECTION_ID,
            typeId
        );

        // Get occupied count
        const occupiedCount = await getOccupiedUnitsCount(typeId);

        // Calculate available
        return unitType.count - occupiedCount;
    } catch (error) {
        console.error("Failed to get available units count:", error);
        throw error;
    }
};

/* -------------------------------------------------------
   PAYMENT MANAGEMENT
-------------------------------------------------------- */

/**
 * Create a new payment record
 */
export const createPayment = async (data: {
    amount: number;
    payment_date: string;
    rental_unit_id: string;
    payment_method: string;
    payment_type: string;
    period_of_bill: string;
}): Promise<Payment> => {
    try {
        const response = await databases.createDocument<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            uniqueId.unique(),
            {
                amount: data.amount,
                payment_date: data.payment_date,
                rental_unit_id: data.rental_unit_id,
                payment_method: data.payment_method,
                payment_type: data.payment_type,
                period_of_bill: data.period_of_bill
            }
        );

        return response;
    } catch (error) {
        console.error("Failed to create payment:", error);
        throw error;
    }
};

/**
 * Get all payments for the current user (across all their rentals)
 */
export const getPayments = async (): Promise<Payment[]> => {
    try {
        // Get all rentals for the user
        const rentals = await getRentals();
        const rentalIds = rentals.map(r => r.$id);

        if (rentalIds.length === 0) {
            return [];
        }

        // Get all payments for these rentals
        const payments = await databases.listDocuments<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            [Query.equal("rental_unit_id", rentalIds)]
        );

        return payments.documents;
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        throw error;
    }
};

/**
 * Get all payments for a specific rental unit
 */
export const getPaymentsByRental = async (rentalId: string): Promise<Payment[]> => {
    try {
        const response = await databases.listDocuments<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            [Query.equal("rental_unit_id", rentalId)]
        );

        return response.documents;
    } catch (error) {
        console.error("Failed to fetch payments for rental:", error);
        throw error;
    }
};

/**
 * Get a single payment by ID
 */
export const getPayment = async (paymentId: string): Promise<Payment> => {
    try {
        const response = await databases.getDocument<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            paymentId
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch payment:", error);
        throw error;
    }
};

/**
 * Update a payment record
 */
export const updatePayment = async (
    paymentId: string,
    data: Partial<{
        amount: number;
        payment_date: string;
        rental_unit_id: string;
        payment_method: string;
        payment_type: string;
        period_of_bill: string;
    }>
): Promise<Payment> => {
    try {
        const response = await databases.updateDocument<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            paymentId,
            data
        );
        return response;
    } catch (error) {
        console.error("Failed to update payment:", error);
        throw error;
    }
};

/**
 * Delete a payment record
 */
export const deletePayment = async (paymentId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            paymentId
        );
    } catch (error) {
        console.error("Failed to delete payment:", error);
        throw error;
    }
};

/* -------------------------------------------------------
   PAYMENT HELPERS & ANALYTICS
-------------------------------------------------------- */

/**
 * Get total amount paid for a specific rental
 */
export const getTotalPaymentsForRental = async (rentalId: string): Promise<number> => {
    try {
        const payments = await getPaymentsByRental(rentalId);
        return payments.reduce((total, payment) => total + payment.amount, 0);
    } catch (error) {
        console.error("Failed to calculate total payments:", error);
        throw error;
    }
};

/**
 * Get payments within a date range
 */
export const getPaymentsByDateRange = async (
    startDate: string,
    endDate: string
): Promise<Payment[]> => {
    try {
        const allPayments = await getPayments();

        // Filter payments by date range
        return allPayments.filter(payment => {
            const paymentDate = new Date(payment.payment_date);
            const start = new Date(startDate);
            const end = new Date(endDate);

            return paymentDate >= start && paymentDate <= end;
        });
    } catch (error) {
        console.error("Failed to fetch payments by date range:", error);
        throw error;
    }
};

/**
 * Get total revenue for a property within a date range
 */
export const getPropertyRevenue = async (
    propertyId: string,
    startDate?: string,
    endDate?: string
): Promise<number> => {
    try {
        // Get all rentals for the property
        const rentals = await getRentalsByProperty(propertyId);
        const rentalIds = rentals.map(r => r.$id);

        if (rentalIds.length === 0) {
            return 0;
        }

        // Get all payments for these rentals
        const allPayments = await databases.listDocuments<Payment>(
            DATABASE_ID,
            PAYMENT_COLLECTION_ID,
            [Query.equal("rental_unit_id", rentalIds)]
        );

        let payments = allPayments.documents;

        // Filter by date range if provided
        if (startDate && endDate) {
            payments = payments.filter(payment => {
                const paymentDate = new Date(payment.payment_date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return paymentDate >= start && paymentDate <= end;
            });
        }

        // Calculate total
        return payments.reduce((total, payment) => total + payment.amount, 0);
    } catch (error) {
        console.error("Failed to calculate property revenue:", error);
        throw error;
    }
};

/**
 * Get recent payments (limit to N most recent)
 */
export const getRecentPayments = async (limit: number = 10): Promise<Payment[]> => {
    try {
        const allPayments = await getPayments();

        // Sort by payment_date descending and limit
        return allPayments
            .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
            .slice(0, limit);
    } catch (error) {
        console.error("Failed to fetch recent payments:", error);
        throw error;
    }
};
