import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import TripCard from "~/components/TripCard";
import type { Trip } from "~/types";

interface PopularTripsProps {
  popular: Trip[];
}

const PopularTrips = ({ popular }: PopularTripsProps) => {
  if (popular.length === 0) return null;

  const getLocationString = (trip: Trip) =>
    trip.itinerary?.[0]?.location ?? trip.location?.city ?? "";

  return (
    <section className="py-20">
      <div className="wrapper">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
              Trending Now
            </p>
            <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
              Popular Trips
            </h2>
          </div>
          <Link
            to="/trips"
            className="hidden sm:flex items-center gap-1.5 text-primary-100 font-plus-jakarta text-sm font-semibold hover:text-primary-500 transition-colors"
          >
            Explore all
            <img src="/assets/icons/arrow-down.svg" alt="" className="h-4 w-4 -rotate-90" />
          </Link>
        </div>

        <div className="trip-grid">
          {popular.map((trip) => (
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

        <div className="flex justify-center mt-10">
          <Link to="/trips">
            <Button className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-8 py-3 rounded-lg">
              Browse All Trips
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularTrips;
