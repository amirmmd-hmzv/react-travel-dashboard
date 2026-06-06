import { Link, type MetaFunction } from "react-router";
import { useEffect, useState } from "react";
import { useUser } from "lib/useCurrentUser";
import { getUserBookings, type Booking } from "lib/appwrite/bookings";

export const meta: MetaFunction = () => [
  { title: "My Bookings — Teal Horizon" },
];

export default function MyBookings() {
  const currentUser = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.accountId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    getUserBookings(currentUser.accountId).then((data) => {
      if (!cancelled) {
        setBookings(data);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [currentUser?.accountId]);

  return (
    <div className="wrapper py-10">
      <div className="mb-8">
        <h1 className="font-clash-display text-dark-100 text-4xl md:text-5xl font-bold leading-tight">
          My Bookings
        </h1>
        <p className="font-plus-jakarta text-dark-400 text-sm mt-2">
          {loading
            ? "Loading your bookings..."
            : bookings.length > 0
              ? `You have ${bookings.length} booked trip${bookings.length !== 1 ? "s" : ""}.`
              : "You haven't booked any trips yet."}
        </p>
      </div>

      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <img src="/assets/icons/destination.svg" alt="" className="h-16 w-16 opacity-30" />
          <div className="text-center">
            <p className="font-clash-display text-dark-100 text-xl font-semibold mb-1">
              No trips booked yet
            </p>
            <p className="font-plus-jakarta text-dark-400 text-sm">
              Start exploring and book your next adventure.
            </p>
          </div>
          <Link
            to="/trips"
            className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-7 py-3 rounded-lg text-sm transition-colors"
          >
            Browse Trips
          </Link>
        </div>
      )}

      {bookings.length > 0 && (
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
                    Booked {new Date(booking.$createdAt).toLocaleDateString()}
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
