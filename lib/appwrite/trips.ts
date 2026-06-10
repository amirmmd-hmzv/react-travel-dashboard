import { Query } from "node-appwrite";
import { parseTripData } from "lib/utils";
import { appwriteConfig } from "./config";
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

export const getServerTrips = async (limit: number, offset: number) => {
  try {
    const { db } = createAdminClient();
    const { documents, total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"),
      ],
    );
    return { allTrips: documents as unknown as AppwriteTripDocument[], total };
  } catch {
    return { allTrips: [], total: 0 };
  }
};

export const getServerTripById = async (tripId: string) => {
  try {
    const { db } = createAdminClient();
    return await db.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      tripId,
    );
  } catch {
    return null;
  }
};

/** Alias used by admin dashboard routes. */
export const getAllTrips = getServerTrips;
/** Alias used by admin trip detail route. */
export const getTripById = getServerTripById;
