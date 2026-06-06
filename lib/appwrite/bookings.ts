import { ID, Query } from "appwrite";
import { db, appwriteConfig } from "./client";

export interface Booking {
  $id: string;
  userId: string;
  tripId: string;
  tripName: string;
  tripImage: string;
  tripLocation: string;
  price: string;
  status: string;
  $createdAt: string;
}

const BOOKINGS = () => ({
  databaseId: appwriteConfig.databaseId,
  collectionId: appwriteConfig.bookingsCollections,
});

export async function createBooking(
  userId: string,
  trip: { id: string; name: string; imageUrls: string[]; location: any; estimatedPrice: string },
  sessionId: string,
) {
  const tripLocation =
    typeof trip.location === "string"
      ? trip.location
      : trip.location?.city ?? "";

  return db.createDocument(
    BOOKINGS().databaseId,
    BOOKINGS().collectionId,
    ID.unique(),
    {
      userId,
      tripId: trip.id,
      tripName: trip.name,
      tripImage: trip.imageUrls?.[0] ?? "",
      tripLocation,
      price: trip.estimatedPrice ?? "",
      // sessionId,
      status: "confirmed",
    },
  );
}

export async function getUserBookings(userId: string) {
  const { documents } = await db.listDocuments(
    BOOKINGS().databaseId,
    BOOKINGS().collectionId,
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ],
  );

  return documents as unknown as Booking[];
}
