import { Query } from "appwrite";
import { parseTripData } from "lib/utils";
import { appwriteConfig, db } from "./client";
import { createAdminClient } from "./server";
import type { Trip } from "app/types";

export type AppwriteTripDocument = {
  $id: string;
  tripDetail: string;
  imageUrls?: string[];
};

export const mapAppwriteTrip = (doc: AppwriteTripDocument): Trip | null => {
  const parsed = parseTripData(doc.tripDetail);
  if (!parsed) return null;

  const { id: _id, imageUrls: _imageUrls, ...tripFields } = parsed;

  return {
    ...tripFields,
    id: doc.$id,
    imageUrls: doc.imageUrls ?? [],
  };
};

export const mapAppwriteTrips = (docs: AppwriteTripDocument[]): Trip[] =>
  docs.map(mapAppwriteTrip).filter((trip): trip is Trip => trip !== null);

export const getAllTrips = async (limit: number, offset: number) => {
  try {
    const { documents: trips, total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      [Query.limit(limit), Query.offset(offset), Query.orderDesc("$createdAt")],
    );

    if (total === 0) {
      console.error("No trips found");
      return { allTrips: [], total: 0 };
    }

    return { allTrips: trips as unknown as AppwriteTripDocument[], total };
  } catch (error) {
    console.error("Error fetching all trips:", error);
    return { allTrips: [], total: 0 };
  }
};

export const getTripById = async (tripId: string) => {
  try {
    const trip = await db.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      tripId,
    );

    if (!trip || !trip.$id) {
      console.error("Trip not found with ID: ", tripId);
      return null;
    }

    return trip;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return null;
  }
};

/**
 * Get count of trips created by a specific user
 * @param userId - The user's account ID
 * @returns Number of trips created by the user
 */
export const getTripCountByUser = async (userId: string): Promise<number> => {
  try {
    if (!userId) return 0;

    const { total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      [Query.equal("userId", userId)],
    );

    return total || 0;
  } catch (error) {
    console.error(`Error fetching trip count for user ${userId}:`, error);
    return 0;
  }
};

export async function getServerTrips(limit: number, offset: number) {
  try {
    const { db: sdb } = createAdminClient();
    const { documents, total } = await sdb.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      [Query.limit(limit), Query.offset(offset), Query.orderDesc("$createdAt")],
    );
    return { allTrips: documents as unknown as AppwriteTripDocument[], total };
  } catch {
    return { allTrips: [], total: 0 };
  }
}

export async function getServerTripById(tripId: string) {
  try {
    const { db: sdb } = createAdminClient();
    return await sdb.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      tripId,
    );
  } catch {
    return null;
  }
}
