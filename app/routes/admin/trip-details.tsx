import { getTripById } from "lib/appwrite/trips";
import type { Route } from "./+types/dashboard";
import { parseTripData } from "lib/utils";
import { Header } from "~/components";

export const loader = async ({ params }: { params: { tripId: string } }) => {
  const { tripId } = params;

  if (!tripId) {
    throw new Error("Trip ID is required");
  }

  const trip = await getTripById(tripId);
  // Fetch trip details using the tripId
  // You can use the getTripById function from lib/appwrite/trips.ts
  // const tripDetails = await getTripById(tripId);
};
const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  const tripData = parseTripData(loaderData?.trip);

  const { name } = tripData || {};
  return (
    <main className="travel-details wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />

      <section className="container wrapper-md"></section>
    </main>
  );
};

export default TripDetails;
