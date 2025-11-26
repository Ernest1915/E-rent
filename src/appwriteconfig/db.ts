import { account, databases, uniqueId, Query } from "../appwriteconfig/config";
import type { Models } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const RENTAL_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RENTAL_COLLECTION_ID;

export interface Rental extends Models.Document {
    "unit-id": string;
    "unit-status": string;
}

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
}): Promise<Rental> => {
    try {
        
         const user = await account.get();

        const response = await databases.createDocument<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            uniqueId.unique(),
            {
                "unit-id": data.unitId,
                "unit-status": data.unitStatus,
                "users_id": user.$id
            },
            
        
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
