import { openDB } from "idb";
import { UserState } from "@/features/auth/reducers/user_slice";

const DB_NAME = "chlpsMemberDB";
const STORE_NAME = "users";

export const getDB = async () => {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is not available in this environment.");
  }

  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "userId" });
      }
    },
  });
};

export const saveUserToDB = async (updatedFields: Partial<UserState>) => {
  const db = await getDB();
  const existingUsers = await db.getAll(STORE_NAME);

  if (updatedFields.userId) {
    for (const user of existingUsers) {
      if (user.userId && user.userId !== updatedFields.userId) {
        await db.delete(STORE_NAME, user.userId);
      }
    }
  }

  const existingUser =
    existingUsers.find((user) => user.userId === updatedFields.userId) ??
    existingUsers[0] ??
    {};

  const mergedUser: UserState = {
    ...existingUser,
    ...updatedFields,
  };

  await db.put(STORE_NAME, mergedUser);
};

export const getUserFromDB = async () => {
  try {
    const db = await getDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error("Error accessing IndexedDB:", error);
    return [];
  }
};

export const clearUserFromDB = async () => {
  try {
    const db = await getDB();
    await db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).clear();
  } catch {
    /* ignore */
  }
};
