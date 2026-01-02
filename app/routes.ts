import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/sign-in.tsx"),
  layout("routes/admin/admin-layout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/all-users.tsx"),
  ]),
  route("/sentry-example-page", "routes/sentry-example-page.tsx"),
  route("/api/sentry-example-api", "routes/api.sentry-example-api.ts")
] satisfies RouteConfig;