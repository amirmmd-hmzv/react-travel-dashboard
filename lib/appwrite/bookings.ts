import { ID, Query } from "appwrite";
import { db, appwriteConfig } from "./client";
import { createSessionClient } from "./server";

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
  // Guard against duplicate bookings: if the user already booked this trip, return the existing one
  const { documents: existing } = await db.listDocuments(
    BOOKINGS().databaseId,
    BOOKINGS().collectionId,
    [
      Query.equal("userId", userId),
      Query.equal("tripId", trip.id),
      Query.limit(1),
    ],
  );

  if (existing.length > 0) {
    return existing[0] as unknown as Booking;
  }

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

export async function hasUserBookedTrip(accountId: string, tripId: string) {
  const { documents } = await db.listDocuments(
    BOOKINGS().databaseId,
    BOOKINGS().collectionId,
    [
      Query.equal("userId", accountId),
      Query.equal("tripId", tripId),
      Query.limit(1),
    ],
  );
  return documents.length > 0;
}

export async function getServerUserBookings(request: Request) {
  try {
    const { account, db: sdb } = createSessionClient(request);
    const userAccount = await account.get();
    if (!userAccount?.$id) return [] as Booking[];

    const { documents } = await sdb.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollections,
      [Query.equal("userId", userAccount.$id), Query.orderDesc("$createdAt")],
    );
    return documents as unknown as Booking[];
  } catch {
    return [] as Booking[];
  }
}
