import { account, databases, Query } from "./config";

const USERS = import.meta.env.VITE_APPWRITE_USERS_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const syncUserWithDatabase = async () => {
  // 1. Get authenticated user
  const authUser = await account.get();

  // 2. Check if user already exists in DB collection
  const existing = await databases.listDocuments(
    DATABASE_ID,
    USERS,
    [Query.equal("$id", authUser.$id)]
  );

  if (existing.total > 0) {
    // User already exists → return it
    return existing.documents[0];
  }

  // 3. Create the user (use the authUser ID as document ID)
  const newUser = await databases.createDocument(
    DATABASE_ID,
    USERS,
    authUser.$id, // <--- FIXED: use the same ID
    {
      username: authUser.name
    }
  );

  return newUser;
};
