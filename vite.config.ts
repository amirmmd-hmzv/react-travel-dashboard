import { sentryReactRouter } from "@sentry/react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");

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

    define: {
      "process.env.APPWRITE_API_KEY": JSON.stringify(env.APPWRITE_API_KEY),
      "process.env.GOOGLE_AI_API_KEY": JSON.stringify(env.GOOGLE_AI_API_KEY),
      "process.env.UNSPLASH_ACCESS_KEY": JSON.stringify(env.UNSPLASH_ACCESS_KEY),
    },
  };
});