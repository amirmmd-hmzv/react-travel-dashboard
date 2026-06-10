import { Link, redirect, useNavigation, type MetaFunction } from "react-router";
import { getUser } from "lib/appwrite/auth";
import { getUserBookings, type Booking } from "lib/appwrite/bookings";
import { EmptyState, TripCardSkeleton } from "~/components";
import { formatDate } from "lib/utils";
import type { Route } from "./+types/my-bookings";

export const meta: MetaFunction = () => [
  { title: "My Bookings — Teal Horizon" },
];

export async function loader() {
  return { bookings: [] as Booking[] };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();

  if (serverData.bookings.length > 0) return serverData;

  try {
    const result = await getUser();
    const user =
      result && !(result instanceof Response) && "accountId" in result
        ? (result as unknown as { accountId: string })
        : null;
    if (!user) return redirect("/");

    const bookings = await getUserBookings(user.accountId);
    return { bookings };
  } catch {
    return redirect("/");
  }
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
    <div className="wrapper py-10">
      <div className="mb-8">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function MyBookings({ loaderData }: Route.ComponentProps) {
  const { bookings } = loaderData;
  const loading = useNavigation().state === "loading";

  return (
    <div className="wrapper py-10">
      <div className="mb-8">
        <h1 className="font-clash-display text-dark-100 text-4xl md:text-5xl font-bold leading-tight">
          My Bookings
        </h1>
        {!loading && (
          <p className="font-plus-jakarta text-dark-400 text-sm mt-2">
            {bookings.length > 0
              ? `You have ${bookings.length} booked trip${bookings.length !== 1 ? "s" : ""}.`
              : "You haven't booked any trips yet."}
          </p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <EmptyState
          title="No trips booked yet"
          description="Start exploring and book your next adventure."
          ctaText="Browse Trips"
          ctaLink="/trips"
        />
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Link
              key={booking.$id}
              to={`/travel/${booking.tripId}`}
              className="group bg-white rounded-[20px] shadow-300 overflow-hidden hover:shadow-500 transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={booking.tripImage || "/assets/icons/destination.svg"}
                  alt={booking.tripName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-clash-display text-dark-100 text-lg font-semibold leading-snug">
                  {booking.tripName}
                </h3>
                {booking.tripLocation && (
                  <p className="font-plus-jakarta text-dark-400 text-sm flex items-center gap-1.5">
                    <img src="/assets/icons/location-mark.svg" alt="" className="h-3.5 w-3.5" />
                    {booking.tripLocation}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  {booking.price && (
                    <span className="font-clash-display text-primary-100 font-semibold text-sm">
                      {booking.price}
                    </span>
                  )}
                  <span className="font-plus-jakarta text-gray-100 text-xs">
                    Booked {formatDate(booking.$createdAt)}
                  </span>
                </div>
                <span className="inline-flex self-start items-center gap-1 bg-success-50 text-success-700 text-xs font-plus-jakarta font-semibold px-2.5 py-0.5 rounded-full">
                  Confirmed
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
