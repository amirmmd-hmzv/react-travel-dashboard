import { account } from "lib/appwrite/client";
import { getExistingUser } from "lib/appwrite/auth";
import { syncSessionToCookie } from "lib/appwrite/session-cookie";

export async function getClientUser() {
  try {
    await syncSessionToCookie();

    const user = await account.get();
    if (!user?.$id) return null;

    return await getExistingUser(user.$id);
  } catch {
    return null;
  }
}
