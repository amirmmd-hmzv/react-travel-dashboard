import { Link } from "react-router";

interface FeaturedDestinationsProps {
  featured: Trip[];
}

const FeaturedDestinations = ({ featured }: FeaturedDestinationsProps) => {
  if (featured.length === 0) return null;

  const getLocationString = (trip: Trip) =>
    trip.itinerary?.[0]?.location ?? trip.location?.city ?? "";

  return (
    <section className="py-20">
      <div className="wrapper">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
              Curated for You
            </p>
            <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
              Featured Destinations
            </h2>
          </div>
          <Link
            to="/trips"
            className="hidden sm:flex items-center gap-1.5 text-primary-100 font-plus-jakarta text-sm font-semibold hover:text-primary-500 transition-colors"
          >
            View all trips
            <img src="/assets/icons/arrow-down.svg" alt="" className="h-4 w-4 -rotate-90" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((trip) => (
            <Link key={trip.id} to={`/travel/${trip.id}`}>
              <article
                className={`group relative rounded-[20px] overflow-hidden shadow-300 bg-white cursor-pointer ${trip === featured[0] ? "md:min-h-[420px]" : "md:min-h-[340px]"} min-h-[280px]`}
              >
                <img
                  src={trip.imageUrls[0]}
                  alt={trip.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 via-dark-100/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-clash-display text-white text-xl font-semibold line-clamp-2 mb-1">
                    {trip.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-white/70 text-xs font-plus-jakarta mb-3">
                    <img src="/assets/icons/location-mark.svg" alt="" className="h-3.5 w-3.5" />
                    {getLocationString(trip)}
                  </div>
                  <span className="inline-block bg-primary-100/90 backdrop-blur text-white text-xs font-plus-jakarta font-semibold px-3 py-1 rounded-full">
                    From {trip.estimatedPrice}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
