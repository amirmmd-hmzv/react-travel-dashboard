export const appwriteConfig = {
  endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINTS,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersCollections: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  tripsCollections: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
};
