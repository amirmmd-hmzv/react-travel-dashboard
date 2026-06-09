import { type ActionFunctionArgs, data } from "react-router";
import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "lib/appwrite/client";
import { createAdminClient } from "lib/appwrite/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { db } = createAdminClient();

  const body: { tripId?: string; userId?: string } = await request.json();
  const { tripId, userId } = body;

  if (!userId) {
    return data({ error: "You must be signed in to book a trip." }, { status: 401 });
  }

  // Verify the user exists in the database
  try {
    const { total } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", userId), Query.limit(1)],
    );
    if (total === 0) {
      return data({ error: "You must be signed in to book a trip." }, { status: 401 });
    }
  } catch {
    return data({ error: "You must be signed in to book a trip." }, { status: 401 });
  }

  if (!tripId) {
    return data({ error: "tripId is required." }, { status: 400 });
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
      ? JSON.parse(tripDoc.tripDetail as string)
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
        tripImage: (tripDoc.imageUrls as string[] | undefined)?.[0] ?? "",
        tripLocation:
          tripDetail.location?.city ?? tripDetail.country ?? "",
        price: tripDetail.estimatedPrice ?? "",
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
