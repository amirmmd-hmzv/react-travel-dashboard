import { sentryReactRouter } from "@sentry/react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");

  // Make non-VITE_ env vars available via process.env for server-side code
  // (VITE_ vars are auto-exposed via import.meta.env, but secrets like
  //  APPWRITE_API_KEY must NOT go to the client bundle via define)
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith("VITE_") && !process.env[key]) {
      process.env[key] = value;
    }
  }

  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      sentryReactRouter(
        {
          org: "personal-sdk",
          project: "teal-horizon-dashboard",
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
        config,
      ),
    ],

  };
});