// lib/appwrite/server.ts
import { Client, Account, Databases, Query } from "node-appwrite";
import { appwriteConfig } from "./client";

export function createSessionClient(request: Request) {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const cookie = request.headers.get("Cookie") || "";
  
  // Try both the standard key and the legacy key Appwrite SDK uses
  const cookieNames = [
    `a_session_${appwriteConfig.projectId}`,
    `a_session_${appwriteConfig.projectId}_legacy`,
  ];

  for (const name of cookieNames) {
    const match = cookie.match(
      new RegExp(`(?:^|;\\s*)${name}=([^;]+)`)
    );
    if (match?.[1]) {
      try {
        client.setSession(decodeURIComponent(match[1]));
      } catch {
        client.setSession(match[1]); // already decoded
      }
      break;
    }
  }

  return {
    account: new Account(client),
    db: new Databases(client),
  };
}

export async function getServerUser(request: Request) {
  try {
    const { account } = createSessionClient(request);
    return await account.get();
  } catch {
    return null;
  }
}


export async function listServerDocuments(
  request: Request,
  collectionId: string,
  queries: string[] = [],
) {
  const { db } = createSessionClient(request);
  return await db.listDocuments(
    appwriteConfig.databaseId,
    collectionId,
    queries,
  );
}

export async function checkServerBooking(
  request: Request,
  accountId: string,
  tripId: string,
) {
  try {
    const { db } = createSessionClient(request);
    const { documents } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollections,
      [Query.equal("userId", accountId), Query.equal("tripId", tripId), Query.limit(1)],
    );
    return documents.length > 0;
  } catch {
    return false;
  }
}

export async function createServerDocument(
  request: Request,
  collectionId: string,
  data: Record<string, unknown>,
  permissions?: string[],
) {
  const { db } = createSessionClient(request);
  return await db.createDocument(
    appwriteConfig.databaseId,
    collectionId,
    "unique()",
    data,
    permissions,
  );
}