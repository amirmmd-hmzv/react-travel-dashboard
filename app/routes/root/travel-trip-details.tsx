// travel-trip-details.tsx
import { Link, useNavigate, type MetaFunction } from "react-router";
import { useState, useEffect } from "react";
import {
  getServerTripById,
  mapAppwriteTrips,
  type AppwriteTripDocument,
} from "lib/appwrite/trips";
import { hasUserBookedTrip } from "lib/appwrite/bookings";
import { getPillItems } from "lib/tripDetails";
import { account, appwriteConfig } from "lib/appwrite/client";
import { getExistingUser } from "lib/appwrite/auth";
import { getServerUser, listServerDocuments, checkServerBooking } from "lib/appwrite/server";
import { syncSessionToCookie } from "lib/appwrite/session-cookie";
import { Query } from "appwrite";                        
import InfoPill from "~/components/trip/InfoPill";
import { TripPills, StarRating } from "~/components";
import Chip from "~/components/ui/chip";
import { Button } from "~/components/ui/button";
import TripDetailNav from "~/components/trip/TripDetailNav";
import { useUser } from "~/hooks/useCurrentUser";
import type { Route } from "./+types/travel-trip-details";

export const meta: MetaFunction = ({ data }) => [
  {
    title: (data as any)?.trip?.name
      ? `${(data as any).trip.name} — Teal Horizon`
      : "Trip — Teal Horizon",
  },
];

// ✅ Server loader: fetches trip + tries to get user from cookie
export async function loader({ params, request }: Route.LoaderArgs) {
  const rawTrip = await getServerTripById(params.tripId);
  if (!rawTrip) throw new Response("Not Found", { status: 404 });

  const [trip] = mapAppwriteTrips([rawTrip as unknown as AppwriteTripDocument]);

  // Try to get user server-side (works after the first load when cookie is set)
  let currentUser = null;
  try {
    const userAccount = await getServerUser(request);
    if (userAccount?.$id) {
      const { documents } = await listServerDocuments(
        request,
        appwriteConfig.usersCollections,
        [Query.equal("accountId", userAccount.$id), Query.limit(1)],
      );
      currentUser = documents?.[0] ?? null;
    }
  } catch {}

  const alreadyBooked = currentUser
    ? await checkServerBooking(request, currentUser.accountId, params.tripId)
    : false;

  return { trip, currentUser, alreadyBooked };
}

// ✅ Client loader: runs on first hydration to fill in user when server missed it
export async function clientLoader({
  serverLoader,
}: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();

  // If server already got the user, no extra work needed
  if (serverData.currentUser) return serverData;

  // Server missed — fall back to Appwrite client SDK (same pattern as root.tsx)
  try {
    const user = await account.get();
    if (!user?.$id) return serverData;

    await syncSessionToCookie();

    const currentUser = await getExistingUser(user.$id);
    const alreadyBooked = currentUser
      ? await hasUserBookedTrip(currentUser.accountId, serverData.trip?.id)
      : false;
    return { ...serverData, currentUser: currentUser ?? null, alreadyBooked };
  } catch {
    return serverData;
  }
}

// ✅ Force clientLoader to run before page renders on first load
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
    <div className="wrapper py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-3/4 bg-gray-200 rounded-lg" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 md:row-span-2 h-82.5 bg-gray-200 rounded-[20px]" />
              <div className="h-37.5 bg-gray-200 rounded-[20px]" />
              <div className="h-37.5 bg-gray-200 rounded-[20px]" />
            </div>
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default function TravelTripDetails({
  loaderData,
}: Route.ComponentProps) {
  const { trip } = loaderData;
  const { user: currentUser } = useUser();
  const [alreadyBooked, setAlreadyBooked] = useState(loaderData.alreadyBooked);

  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!currentUser) setAlreadyBooked(false);
  }, [currentUser]);

  if (!trip) return null;

  const images: string[] = trip.imageUrls ?? [];
  const itinerary: any[] = trip.itinerary ?? [];
  const duration = itinerary.length;
  const price = trip.estimatedPrice;
  const pillItems = getPillItems({
    travelStyle: trip.travelStyle,
    groupType: trip.groupType,
    budget: trip.budget,
    interests: trip.interests,
  });

  async function handleBooking() {
    const uid = currentUser?.accountId;

    if (!uid) return;
    setBooking(true);
    try {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip.id }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.alreadyBooked) {
        setAlreadyBooked(true);
      } else {
        navigate(`/payment/success?sessionId=${data.sessionId}&tripId=${trip.id}`);
      }
    } catch {
      setBooking(false);
    }
  }

  return (
    <>
      <TripDetailNav />

      <div className="wrapper py-10 travel-detail">
        {/* ── Header ── */}
        <header className="mb-8">
          <h1 className="font-clash-display text-dark-100 text-4xl md:text-5xl font-bold leading-tight mb-4">
            {trip.name}
          </h1>
          <div className="flex items-center gap-5">
            {duration > 0 && (
              <InfoPill
                text={`${duration} day plan`}
                image="/assets/icons/calendar.svg"
              />
            )}
            {trip.location && (
              <InfoPill
                text={
                  typeof trip.location === "string"
                    ? trip.location
                    : [trip.location.city, trip.country]
                        .filter(Boolean)
                        .join(", ")
                }
                image="/assets/icons/location-mark.svg"
              />
            )}
          </div>
        </header>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT: images + content ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Gallery */}
            {images.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-[20px] overflow-hidden">
                {images.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${trip.name} ${i + 1}`}
                    className={
                      i === 0
                        ? "md:col-span-2 md:row-span-2 w-full h-82.5 object-cover"
                        : "md:row-span-1 w-full h-37.5 object-cover"
                    }
                  />
                ))}
              </section>
            )}

            {pillItems.length > 0 && (
              <TripPills pillItems={pillItems} rating={trip.rating ?? 0} />
            )}

            {/* Title section */}
            <section className="title">
              <article>
                <h3 className="font-clash-display text-dark-100 text-2xl font-semibold">
                  {duration}-Day {trip.country} {trip.travelStyle} Trip
                </h3>
                <p className="font-plus-jakarta text-dark-400 text-sm">
                  {[trip.budget, trip.groupType, trip.interests]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </article>
              <h2 className="font-clash-display text-dark-100 text-3xl font-bold mt-2">
                {price}
              </h2>
            </section>

            {/* Description */}
            {trip.description && (
              <p className="text-sm md:text-lg font-normal text-dark-400 leading-relaxed">
                {trip.description}
              </p>
            )}

            {/* Day-by-day itinerary */}
            {itinerary.length > 0 && (
              <ul className="flex flex-col gap-6">
                {itinerary.map((dayPlan: any, index: number) => (
                  <li key={index} className="flex flex-col gap-2">
                    <h3 className="font-clash-display text-dark-100 text-lg font-semibold">
                      Day {dayPlan.day ?? index + 1}: {dayPlan.location}
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      {dayPlan.activities.map((activity: any, ai: number) => (
                        <li
                          key={ai}
                          className="flex items-start gap-2 font-plus-jakarta text-dark-400 text-sm"
                        >
                          <span className="font-semibold text-dark-100 flex-shrink-0">
                            {activity.time}
                          </span>
                          <p className="grow">{activity.description}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

            {/* Visit time & weather */}
            <section className="visit">
              {trip.bestTimeToVisit && trip.bestTimeToVisit.length > 0 && (
                <div>
                  <h3 className="font-clash-display text-dark-100 text-lg font-semibold mb-2">
                    Best Time to Visit:
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {trip.bestTimeToVisit.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="font-plus-jakarta text-dark-400 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trip.weatherInfo && trip.weatherInfo.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-clash-display text-dark-100 text-lg font-semibold mb-2">
                    Weather:
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {trip.weatherInfo.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="font-plus-jakarta text-dark-400 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT: sticky booking card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-[20px] shadow-500 p-6 flex flex-col gap-5">
              {/* Price */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-plus-jakarta text-gray-100 text-xs mb-0.5">
                    Starting from
                  </p>
                  <p className="font-clash-display text-dark-100 text-3xl font-bold">
                    {price?.toLocaleString?.() ?? price}
                  </p>
                  <p className="font-plus-jakarta text-gray-100 text-xs">
                    per person
                  </p>
                </div>
                {trip.rating != null && (
                  <div className="flex flex-col items-end gap-1">
                    <StarRating rating={trip.rating} />
                    <span className="font-plus-jakarta text-gray-100 text-xs">
                      {trip.rating}/5
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-light-300" />

              {/* Trip summary */}
              <div className="flex flex-col gap-2">
                {duration > 0 && (
                  <div className="flex items-center justify-between font-plus-jakarta text-sm">
                    <span className="text-gray-100">Duration</span>
                    <span className="text-dark-100 font-semibold">
                      {duration} day{duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {trip.groupType && (
                  <div className="flex items-center justify-between font-plus-jakarta text-sm">
                    <span className="text-gray-100">Group type</span>
                    <span className="text-dark-100 font-semibold capitalize">
                      {trip.groupType}
                    </span>
                  </div>
                )}
                {trip.budget && (
                  <div className="flex items-center justify-between font-plus-jakarta text-sm">
                    <span className="text-gray-100">Budget</span>
                    <span className="text-dark-100 font-semibold capitalize">
                      {trip.budget}
                    </span>
                  </div>
                )}
                {trip.travelStyle && (
                  <div className="flex items-center justify-between font-plus-jakarta text-sm">
                    <span className="text-gray-100">Style</span>
                    <span className="text-dark-100 font-semibold capitalize">
                      {trip.travelStyle}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-light-300" />

              {/* Booking CTA */}

              {currentUser ? (
                alreadyBooked ? (
                  <div className="flex flex-col gap-3">
                    <Link to="/my-bookings">
                      <Button className="w-full bg-success-50 hover:bg-success-100 text-success-700 border border-success-200 font-plus-jakarta font-semibold py-3 rounded-lg text-sm transition-colors">
                        ✓ Already Booked — View Bookings
                      </Button>
                    </Link>
                    <p className="font-plus-jakarta text-gray-100 text-xs text-center">
                      This trip is already in your bookings.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold py-3 rounded-lg text-sm transition-colors"
                      disabled={booking}
                      onClick={handleBooking}
                    >
                      {booking ? "Booking..." : "Book This Trip"}
                    </Button>
                    <p className="font-plus-jakarta text-gray-100 text-xs text-center">
                      🔒 Secure checkout — no real payment processed
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/sign-in">
                    <Button className="w-full bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold py-3 rounded-lg text-sm">
                      Sign In to Book
                    </Button>
                  </Link>
                  <p className="font-plus-jakarta text-gray-100 text-xs text-center">
                    Free account required to book
                  </p>
                </div>
              )}

              {/* What's included */}
              <div className="bg-navy-50 rounded-xl p-4">
                <p className="font-plus-jakarta text-dark-100 text-xs font-semibold mb-2">
                  What's included
                </p>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "AI-generated day-by-day itinerary",
                    "Hotel & activity recommendations",
                    "Weather forecast per destination",
                    "Downloadable trip plan (PDF)",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 font-plus-jakarta text-dark-400 text-xs"
                    >
                      <img
                        src="/assets/icons/blue-check.svg"
                        alt=""
                        className="h-3.5 w-3.5 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
