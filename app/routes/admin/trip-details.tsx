import { getAllTrips, getTripById, mapAppwriteTrips } from "lib/appwrite/trips";
import { parseTripData } from "lib/utils";
import { Header, AsyncTripGrid } from "~/components";
import { useNavigation } from "react-router";
import TripDetailsBody from "~/components/trip/TripDetailsBody";
import type { Route } from "./+types/trip-details";

export const loader = async ({ params }: { params: { tripId: string } }) => {
  const { tripId } = params;

  if (!tripId) {
    throw new Response("Trip ID is required", { status: 400 });
  }

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    popularTrips: mapAppwriteTrips(trips.allTrips),
  };
};

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  const isLoading = useNavigation().state === "loading";
  const tripData = parseTripData(loaderData?.trip?.tripDetail);

  if (!tripData) {
    return (
      <main className="travel-detail wrapper">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
        />
        <p className="text-center text-dark-400">Unable to load trip details.</p>
      </main>
    );
  }

  const imageUrls = loaderData?.trip?.imageUrls ?? [];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />

      <TripDetailsBody tripData={tripData} imageUrls={imageUrls} />

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <AsyncTripGrid loading={isLoading} trips={loaderData.popularTrips} skeletonCount={4} />
      </section>
    </main>
  );
};

export default TripDetails;
