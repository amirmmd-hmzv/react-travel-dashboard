import { TripCard, TripCardSkeleton } from "~/components";
import type { Trip } from "~/types";
import { getLocationString, getFirstImage } from "lib/utils";

interface AsyncTripGridProps {
  loading: boolean;
  trips: Trip[];
  skeletonCount?: number;
}

const AsyncTripGrid = ({
  loading,
  trips,
  skeletonCount = 4,
}: AsyncTripGridProps) => {
  if (loading) {
    return (
      <div className="trip-grid mb-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="trip-grid mb-4">
      {trips.map((trip) => (
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
  );
};

export default AsyncTripGrid;
