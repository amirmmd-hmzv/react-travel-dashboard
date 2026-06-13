import { Client, Databases, ID, Query } from "node-appwrite";
import { appwriteConfig } from "./config";

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(process.env.APPWRITE_API_KEY!);
  return {
    db: new Databases(client),
  };
}

export async function listAdminDocuments(
  collectionId: string,
  queries: string[] = [],
) {
  const { db } = createAdminClient();
  return db.listDocuments(appwriteConfig.databaseId, collectionId, queries);
}

export async function createDocument(
  collectionId: string,
  data: Record<string, unknown>,
  permissions?: string[],
) {
  const { db } = createAdminClient();
  return db.createDocument(
    appwriteConfig.databaseId,
    collectionId,
    ID.unique(),
    data,
    permissions,
  );
}
// اضافه کن به server.ts
export async function incrementUserTripCount(accountId: string) {
  try {
    const { db } = createAdminClient();
    const { documents } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", accountId), Query.limit(1)],
    );

    if (!documents[0]) return;

    const user = documents[0];
    await db.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      user.$id,
      { tripCount: (user.tripCount ?? 0) + 1 },
    );
  } catch {}
}

export async function decrementUserTripCount(accountId: string) {
  try {
    const { db } = createAdminClient();
    const { documents } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", accountId), Query.limit(1)],
    );

    if (!documents[0]) return;

    const user = documents[0];
    const current = user.tripCount ?? 0;
    await db.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      user.$id,
      { tripCount: Math.max(0, current - 1) },
    );
  } catch {}
}
