import { account, databases, uniqueId, Permission, Role, Query } from "../appwriteconfig/config";
import type { Models } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const RENTAL_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RENTAL_COLLECTION_ID;

export interface Rental extends Models.Document {
    "unit-id": string;
    "unit-status": string;
    ownerId: string; // new field
}

// ✅ Fetch only rentals created by the logged-in user
export const getRentals = async (): Promise<Rental[]> => {
    try {
        const user = await account.get();

        const response: Models.DocumentList<Rental> = await databases.listDocuments<Rental>(
            DATABASE_ID,
            RENTAL_COLLECTION_ID,
            [
                Query.equal("ownerId", user.$id) // row filter
            ]
        );

        return response.documents;
    } catch (error) {
        console.error("Failed to fetch rentals:", error);
        throw error;
    }
};

// ✅ Create a rental with row permissions & ownerId
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
                ownerId: user.$id,
            },
            [
                Permission.read(Role.user(user.$id)),
                Permission.write(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
            ]
        );

        return response;
    } catch (error) {
        console.error("Failed to create rental:", error);
        throw error;
    }
};

// ✅ Delete rental (Appwrite will automatically block unauthorized users)
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
