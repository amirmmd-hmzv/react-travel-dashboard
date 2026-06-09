import { ID, Query } from "appwrite";
import { Query as ServerQuery } from "node-appwrite";
import { OAuthProvider, account, db, appwriteConfig } from "../appwrite/client";
import { listAdminDocuments } from "./server";
import { redirect } from "react-router";

export interface AppwriteUserDocument {
  $id: string;
  accountId: string;
  email: string;
  name: string;
  imageUrl: string | null;
  joinedAt: string;
  status: string;
  tripCount?: number;
}

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", id)],
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    // ✅ Check if user already exists before creating
    const existingUser = await getExistingUser(user.$id);
    if (existingUser) return existingUser;

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const createdUser = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
        status: "user",
      },
    );

    if (!createdUser.$id) return redirect("/sign-in");
    return createdUser;
  } catch (error) {
    console.error("Error storing user data:", error);
    return redirect("/sign-in");
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`,
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    const base = `a_session_${appwriteConfig.projectId}`;
    const expired = `; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
    document.cookie = `${base}=${expired}`;
    document.cookie = `${base}_legacy=${expired}`;
    localStorage.removeItem(base);
    localStorage.removeItem(`${base}_legacy`);
    localStorage.removeItem("cookieFallback");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/sign-in");

    const { documents } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId", "status"]),
      ],
    );

    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.limit(limit), Query.offset(offset)],
    );

    if (total === 0) return { users: [], total };

    return { users, total };
  } catch (e) {
    console.error("Error fetching users", e);
    return { users: [], total: 0 };
  }
};

/**
 * Get users with their trip count in a single operation (best practice)
 * Fetches all user data and counts trips for each user in one batch operation
 * @param limit - Number of users to fetch
 * @param offset - Number of users to skip
 * @returns Array of users with trip counts and total count
 */
export const getAllUsersWithTripCount = async (
  limit: number,
  offset: number,
) => {
  try {
    const [usersResult, tripsResult] = await Promise.all([
      listAdminDocuments(appwriteConfig.usersCollections, [
        ServerQuery.limit(limit),
        ServerQuery.offset(offset),
      ]),
      listAdminDocuments(appwriteConfig.tripsCollections, [
        ServerQuery.select(["userId"]),
        ServerQuery.limit(5000),
      ]),
    ]);

    if (usersResult.total === 0) return { users: [], total: 0 };

    const tripCountByUser = tripsResult.documents.reduce(
      (acc: Record<string, number>, trip) => {
        const userId = trip.userId as string;
        if (userId) acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      },
      {},
    );

    const usersWithCounts = usersResult.documents.map((user) => ({
      ...(user as unknown as AppwriteUserDocument),
      tripCount: tripCountByUser[user.accountId as string] ?? 0,
    }));

    return {
      users: usersWithCounts as AppwriteUserDocument[],
      total: usersResult.total,
    };
  } catch (e) {
    console.error("Error fetching users with trip count", e);
    return { users: [], total: 0 };
  }
};
