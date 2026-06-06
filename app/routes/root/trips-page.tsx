import { type MetaFunction } from "react-router";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import TripCard from "~/components/TripCard";
import AppPagination from "~/components/AppPagination";
import type { Route } from "./+types/trips-page";

const LIMIT = 12;

export const meta: MetaFunction = () => [
  { title: "Explore Trips — Teal Horizon" },
  { name: "description", content: "Browse AI-crafted travel itineraries for every kind of explorer." },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * LIMIT;

  const { allTrips, total } = await getAllTrips(LIMIT, offset);

  return {
    trips: mapAppwriteTrips(allTrips),
    total,
    currentPage: page,
  };
}

const getLocationString = (trip: Trip) =>
  trip.itinerary?.[0]?.location ?? trip.location?.city ?? "";

const TripsPage = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData?.trips ?? [];
  const total = loaderData?.total ?? 0;
  const currentPage = loaderData?.currentPage ?? 1;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main className="wrapper py-12">
      <header className="mb-10">
        <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
          Explore
        </p>
        <h1 className="font-clash-display text-dark-100 text-4xl font-bold mb-2">
          All Trips
        </h1>
        <p className="font-plus-jakarta text-gray-100 text-base max-w-xl">
          Browse AI-crafted travel itineraries for every kind of explorer.
        </p>
      </header>

      {trips.length > 0 ? (
        <>
          <div className="trip-grid mb-10">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.name}
                imageUrl={trip.imageUrls?.[0] ?? ""}
                location={getLocationString(trip)}
                tags={[trip.interests, trip.travelStyle]}
                price={trip.estimatedPrice}
              />
            ))}
          </div>

          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            className="mb-8"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-plus-jakarta text-gray-100 text-lg mb-2">No trips found</p>
          <p className="font-plus-jakarta text-gray-100 text-sm">Check back later for new adventures.</p>
        </div>
      )}
    </main>
  );
};

export default TripsPage;
