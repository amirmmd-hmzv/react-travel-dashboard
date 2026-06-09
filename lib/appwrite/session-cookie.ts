import { appwriteConfig, account } from "./client";

/** Sync Appwrite browser session to cookies so SSR loaders can read it. */
export async function syncSessionToCookie(): Promise<void> {
  if (typeof document === "undefined") return;

  try {
    const session = await account.getSession("current");
    if (!session?.secret) return;

    const cookieName = `a_session_${appwriteConfig.projectId}`;
    const secure = location.protocol === "https:" ? "; secure" : "";
    const opts = `; path=/; max-age=2592000; samesite=lax${secure}`;
    const encoded = encodeURIComponent(session.secret);

    document.cookie = `${cookieName}=${encoded}${opts}`;
    document.cookie = `${cookieName}_legacy=${encoded}${opts}`;
  } catch {
    /* best-effort */
  }
}
