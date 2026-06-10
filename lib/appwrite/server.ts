import { Client, Databases, ID } from "node-appwrite";
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
  return db.listDocuments(
    appwriteConfig.databaseId,
    collectionId,
    queries,
  );
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
