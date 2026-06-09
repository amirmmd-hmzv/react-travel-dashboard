import { Link } from "react-router";
import type { Trip } from "~/types";
import { getLocationString } from "lib/utils";
import { SectionHeader } from "~/components";

interface FeaturedDestinationsProps {
  featured: Trip[];
}

const FeaturedDestinations = ({ featured }: FeaturedDestinationsProps) => {
  if (featured.length === 0) return null;

  return (
    <section className="py-20">
      <div className="wrapper">
        <SectionHeader
          eyebrow="Curated for You"
          title="Featured Destinations"
          linkText="View all trips"
          linkTo="/trips"
        />

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
