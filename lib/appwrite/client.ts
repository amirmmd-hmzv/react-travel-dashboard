import { Client, Account, OAuthProvider, Databases } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client();
client.setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectId);

const account = new Account(client);

const db = new Databases(client);

export { OAuthProvider, db, account, appwriteConfig };
