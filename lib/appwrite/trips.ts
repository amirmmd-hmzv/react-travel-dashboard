import { Query } from "appwrite";
import { appwriteConfig, db } from "./client";

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

    return { allTrips: trips, total };
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

    return trip; // <--- This was missing
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return null;
  }
};
