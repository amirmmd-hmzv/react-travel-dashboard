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
import { appwriteConfig } from "lib/appwrite/config";
import { getClientUser } from "lib/client-user";
import { Toaster } from "~/components/ui/sonner";
import type { Route } from "./+types/root";
import "./app.css";

export async function loader() {
  return { currentUser: null };
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader<Awaited<ReturnType<typeof loader>>>();
  if (serverData?.currentUser) return serverData;

  const currentUser = await getClientUser();
  return { currentUser };
}

// ⬇️ CRITICAL: This forces the clientLoader to run BEFORE the page renders on hydration.
// Without this, you get a flash because SSR renders null, then client updates.
clientLoader.hydrate = true as const;

// ⬇️ This renders during SSR (and during hydration while clientLoader runs).
// Replace with your actual loading skeleton/spinner.
export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-200">
      <img
        src="/assets/icons/logo.svg"
        alt="Teal Horizon"
        className="h-12 w-auto animate-pulse"
      />
    </div>
  );
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
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
        <Toaster position="top-center" />
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