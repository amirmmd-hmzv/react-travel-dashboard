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
import { UserProvider } from "~/hooks/useCurrentUser";
import { getServerUserDocument } from "lib/appwrite/server";
import { syncSessionToCookie } from "lib/appwrite/session-cookie";
import { appwriteConfig, account } from "lib/appwrite/client";
import { getExistingUser } from "lib/appwrite/auth";
import type { Route } from "./+types/root";
import "./app.css";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userDoc = await getServerUserDocument(request);
    return { currentUser: userDoc };
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

    await syncSessionToCookie();

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
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-200">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 rounded-full bg-primary-100/30 animate-pulse" />
        <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
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