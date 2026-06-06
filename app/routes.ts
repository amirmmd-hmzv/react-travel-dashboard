import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/sign-in.tsx"),
  route("api/create-trip", "routes/api/create-trip.ts"),
  layout("routes/admin/admin-layout.tsx", [
    route("admin/dashboard", "routes/admin/dashboard.tsx"),
    route("admin/all-users", "routes/admin/all-users.tsx"),
    route("admin/trips", "routes/admin/trips.tsx"),
    route("admin/trips/create", "routes/admin/create-trip.tsx"),
    route("admin/trips/:tripId", "routes/admin/trip-details.tsx"),
  ]),
  layout("routes/root/page-layout.tsx", [
    index("routes/root/travel-page.tsx"),
    route("trips", "routes/root/trips-page.tsx"),
    route("travel/:tripId", "routes/root/travel-trip-details.tsx"),
  ]),
  route("/sentry-example-page", "routes/sentry-example-page.tsx"),
  route("/api/sentry-example-api", "routes/api.sentry-example-api.ts"),
] satisfies RouteConfig;
