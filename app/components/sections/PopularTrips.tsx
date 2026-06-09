import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import TripCard from "~/components/trip/TripCard";
import type { Trip } from "~/types";
import { getLocationString, getFirstImage } from "lib/utils";
import { SectionHeader } from "~/components";

interface PopularTripsProps {
  popular: Trip[];
}

const PopularTrips = ({ popular }: PopularTripsProps) => {
  if (popular.length === 0) return null;

  return (
    <section className="py-20">
      <div className="wrapper">
        <SectionHeader
          eyebrow="Trending Now"
          title="Popular Trips"
          linkText="Explore all"
          linkTo="/trips"
        />

        <div className="trip-grid">
          {popular.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              imageUrl={getFirstImage(trip)}
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
