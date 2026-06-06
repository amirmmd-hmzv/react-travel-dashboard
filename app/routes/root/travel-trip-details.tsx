import { getAllTrips, getTripById, mapAppwriteTrips } from "lib/appwrite/trips";
import { parseTripData } from "lib/utils";
import { Link } from "react-router";
import { TripCard } from "~/components";
import TripDetailsBody from "~/components/TripDetailsBody";
import type { Route } from "./+types/travel-trip-details";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { tripId } = params;

  if (!tripId) {
    throw new Response("Trip not found", { status: 404 });
  }

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  if (!trip) {
    throw new Response("Trip not found", { status: 404 });
  }

  return {
    trip,
    popularTrips: mapAppwriteTrips(trips.allTrips),
  };
};

const TravelTripDetails = ({ loaderData }: Route.ComponentProps) => {
  const tripData = parseTripData(loaderData.trip.tripDetail);

  if (!tripData) {
    return (
      <main className="travel-detail wrapper">
        <p className="text-center text-dark-400">Unable to load trip details.</p>
      </main>
    );
  }

  const imageUrls = loaderData.trip.imageUrls ?? [];

  return (
    <main className="travel-detail wrapper">
      <Link to="/" className="back-link">
        <img src="/assets/icons/arrow-left.svg" alt="" />
        <span>Back to Home</span>
      </Link>

      <TripDetailsBody tripData={tripData} imageUrls={imageUrls} />

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {loaderData.popularTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default TravelTripDetails;
