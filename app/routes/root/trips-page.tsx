import { Link, useNavigation, type MetaFunction } from "react-router";
import { getServerTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import { AsyncTripGrid, EmptyState } from "~/components";
import AppPagination from "~/components/AppPagination";
import type { Route } from "./+types/trips-page";

const LIMIT = 12;

export const meta: MetaFunction = () => [
  { title: "Explore Trips — Teal Horizon" },
  {
    name: "description",
    content:
      "Browse AI-crafted travel itineraries for every kind of explorer.",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const offset = (page - 1) * LIMIT;

  const { allTrips, total } = await getServerTrips(LIMIT, offset);

  return {
    trips: mapAppwriteTrips(allTrips),
    total,
    currentPage: page,
  };
}

export default function TripsPage({ loaderData }: Route.ComponentProps) {
  const trips = loaderData?.trips ?? [];
  const total = loaderData?.total ?? 0;
  const currentPage = loaderData?.currentPage ?? 1;
  const totalPages = Math.ceil(total / LIMIT);
  const isLoading = useNavigation().state === "loading";

  return (
    <div className="min-h-screen bg-light-200">
      {/* ── Page hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-100 via-dark-100/95 to-primary-100/60 py-16">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-100/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-navy-500/10 blur-2xl" />

        <div className="wrapper relative flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/50 text-xs font-plus-jakarta">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80">Trips</span>
          </div>

          <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest">
            Explore
          </p>
          <h1 className="font-clash-display text-white text-5xl font-bold leading-tight">
            Find Your Next
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-500 to-primary-100">
              Adventure
            </span>
          </h1>
          <p className="font-plus-jakarta text-white/60 text-base max-w-lg">
            {total > 0
              ? `${total} AI-crafted itineraries for every kind of explorer.`
              : "AI-crafted itineraries for every kind of explorer."}
          </p>
        </div>
      </div>

      {/* ── Trip grid ── */}
      <main className="wrapper py-12">
        {isLoading ? (
          <AsyncTripGrid loading={isLoading} trips={[]} skeletonCount={LIMIT} />
        ) : trips.length > 0 ? (
          <>
            <AsyncTripGrid loading={false} trips={trips} />

            {totalPages > 1 && (
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                className="mb-8"
              />
            )}
          </>
        ) : (
          <EmptyState
            title="No trips yet"
            description="New adventures are being crafted. Check back soon — or create your own."
            ctaText="Back to Home"
            ctaLink="/"
          />
        )}
      </main>
    </div>
  );
}