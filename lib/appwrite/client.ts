import { Client, Account, OAuthProvider, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINTS,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersCollections: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  tripsCollections: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
  bookingsCollections: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
};

const client = new Client();
client.setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectId);

const account = new Account(client);

const db = new Databases(client);

const storage = new Storage(client);

export { OAuthProvider, db, storage, account };
