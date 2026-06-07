import { type ActionFunctionArgs, data } from "react-router";
import { ID, Query } from "appwrite";
import { db, appwriteConfig } from "lib/appwrite/client";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body: { userId?: string; tripId?: string } = await request.json();
  console.log(body)
  const { userId, tripId } = body;

  if (!userId || !tripId) {
    return data({ error: "userId and tripId are required." }, { status: 400 });
  }

  try {
    const existing = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollections,
      [
        Query.equal("userId", userId),
        Query.equal("tripId", tripId),
        Query.limit(1),
      ],
    );

    if (existing.total > 0) {
      return data({
        id: existing.documents[0].$id,
        alreadyBooked: true,
      });
    }

    const tripDoc = await db.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollections,
      tripId,
    );

    const tripDetail = tripDoc.tripDetail
      ? JSON.parse(tripDoc.tripDetail)
      : {};
    const sessionId = `cs_${crypto.randomUUID()}`;

    const booking = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollections,
      ID.unique(),
      {
        userId,
        tripId,
        tripName: tripDetail.name ?? "Untitled Trip",
        tripImage: tripDoc.imageUrls?.[0] ?? "",
        tripLocation:
          tripDetail.location?.city ?? tripDetail.country ?? "",
        price: tripDetail.estimatedPrice ?? "",
        // sessionId,
        status: "confirmed",
      },
    );

    return data({ id: booking.$id, sessionId, alreadyBooked: false });
  } catch (e) {
    console.error("Error creating booking:", e);
    return data(
      { error: "Failed to create booking. Please try again." },
      { status: 500 },
    );
  }
};
