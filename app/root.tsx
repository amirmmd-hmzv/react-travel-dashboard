// root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { Query } from "appwrite";
import { UserProvider } from "lib/useCurrentUser";
import { getServerUser, listServerDocuments } from "lib/appwrite/server";
import { appwriteConfig, account } from "lib/appwrite/client";
import { getExistingUser } from "lib/appwrite/auth";
import type { Route } from "./+types/root";
import "./app.css";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userAccount = await getServerUser(request);
    if (!userAccount?.$id) return { currentUser: null };

    const { documents } = await listServerDocuments(
      request,
      appwriteConfig.usersCollections,
      [Query.equal("accountId", userAccount.$id), Query.limit(1)],
    );
    return { currentUser: documents?.[0] ?? null };
  } catch {
    return { currentUser: null };
  }
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  try {
    const serverData = await serverLoader<Awaited<ReturnType<typeof loader>>>();
    if (serverData?.currentUser) return serverData;

    // Server missed — try client SDK
    const user = await account.get();
    if (!user?.$id) return { currentUser: null };

    // Write session cookie to our domain so the NEXT SSR request works
    try {
      const session = await account.getSession("current");
      if (session?.secret) {
        const cookieName = `a_session_${appwriteConfig.projectId}`;
        const secure = location.protocol === "https:" ? "; secure" : "";
        // Write BOTH keys so server.ts can find it regardless of SDK version
        document.cookie = `${cookieName}=${encodeURIComponent(session.secret)}; path=/; max-age=2592000; samesite=lax${secure}`;
        document.cookie = `${cookieName}_legacy=${encodeURIComponent(session.secret)}; path=/; max-age=2592000; samesite=lax${secure}`;
      }
    } catch { /* best-effort */ }

    const existingUser = await getExistingUser(user.$id);
    return { currentUser: existingUser ?? null };
  } catch {
    return { currentUser: null };
  }
}

// ⬇️ CRITICAL: This forces the clientLoader to run BEFORE the page renders on hydration.
// Without this, you get a flash because SSR renders null, then client updates.
clientLoader.hydrate = true as const;

// ⬇️ This renders during SSR (and during hydration while clientLoader runs).
// Replace with your actual loading skeleton/spinner.
export function HydrateFallback() {
  return null; // or <YourAppShell loading /> if you have one
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/*
          Sync Appwrite session to a cookie on our domain BEFORE React hydrates.
          The Appwrite Web SDK (v16+) stores the session under:
            localStorage key: `a_session_<projectId>`  (JSON string with .secret)
          Older SDKs used `cookieFallback` — we check both.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var pid = "${appwriteConfig.projectId}";
    var cn = "a_session_" + pid;
    var hasCookie = document.cookie.split(";").some(function(x){ return x.trim().startsWith(cn + "="); });
    if (!hasCookie) {
      // Try modern SDK key first (stores JSON with .secret)
      var raw = localStorage.getItem(cn) || localStorage.getItem("cookieFallback");
      if (raw) {
        var parsed = JSON.parse(raw);
        // Modern SDK: value is a JSON object with a "secret" field
        // Legacy SDK: cookieFallback is a JSON object keyed by session name
        var secret = parsed && parsed.secret
          ? parsed.secret
          : (parsed && parsed[cn] ? parsed[cn] : null);
        if (secret) {
          var sec = location.protocol === "https:" ? "; secure" : "";
          document.cookie = cn + "=" + encodeURIComponent(secret) + "; path=/; max-age=2592000; samesite=lax" + sec;
          document.cookie = cn + "_legacy=" + encodeURIComponent(secret) + "; path=/; max-age=2592000; samesite=lax" + sec;
        }
      }
    }
  } catch(e) {}
})();`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { currentUser } = useLoaderData() as {
    currentUser: Record<string, any> | null;
  };

  return (
    <UserProvider user={currentUser}>
      <Outlet />
    </UserProvider>
  );
}

// ErrorBoundary stays the same...