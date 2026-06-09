import { Client, Account, Databases, Query } from "node-appwrite";
import { appwriteConfig } from "./client";

export interface ServerUserDocument {
  $id: string;
  accountId: string;
  email: string;
  name: string;
  imageUrl: string | null;
  joinedAt: string;
  status: "admin" | "user" | string;
}

export function createSessionClient(request: Request) {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const cookie = request.headers.get("Cookie") || "";
  
  const cookieNames = [
    `a_session_${appwriteConfig.projectId}`,
    `a_session_${appwriteConfig.projectId}_legacy`,
  ];

  let sessionSecret: string | null = null;

  for (const name of cookieNames) {
    const match = cookie.match(
      new RegExp(`(?:^|;\\s*)${name}=([^;]+)`)
    );
    if (match?.[1]) {
      try {
        sessionSecret = decodeURIComponent(match[1]);
      } catch {
        sessionSecret = match[1];
      }
      break;
    }
  }

  if (!sessionSecret) {
    sessionSecret = request.headers.get("X-Appwrite-Session");
  }

  if (sessionSecret) {
    client.setSession(sessionSecret);
  }

  return {
    account: new Account(client),
    db: new Databases(client),
  };
}

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(import.meta.env.APPWRITE_API_KEY!);
  return {
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

export async function getServerUserDocument(
  request: Request,
): Promise<ServerUserDocument | null> {
  try {
    const userAccount = await getServerUser(request);
    if (!userAccount?.$id) return null;

    const { db } = createAdminClient();
    const { documents } = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", userAccount.$id), Query.limit(1)],
    );

    return (documents[0] as unknown as ServerUserDocument | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function requireAdminUser(
  request: Request,
): Promise<ServerUserDocument | null> {
  const userDoc = await getServerUserDocument(request);
  console.log("userdoc",userDoc)
  if (!userDoc || userDoc.status !== "admin") return null;
  return userDoc;
}

export async function listAdminDocuments(
  collectionId: string,
  queries: string[] = [],
) {
  const { db } = createAdminClient();
  return db.listDocuments(
    appwriteConfig.databaseId,
    collectionId,
    queries,
  );
}