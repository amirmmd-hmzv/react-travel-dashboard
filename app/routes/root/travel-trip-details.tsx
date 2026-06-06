import { Link, redirect, type MetaFunction } from "react-router";
import { getTripById, mapAppwriteTrips, type AppwriteTripDocument } from "lib/appwrite/trips";
import { getUser } from "lib/appwrite/auth";
import StarRating from "~/components/StarRating";
import InfoPill from "~/components/InfoPill";
import Chip from "~/components/ui/Cheap";
import { Button } from "~/components/ui/button";
import TripDetailNav from "~/components/TripDetailNav";
import type { Route } from "./+types/travel-trip-details";

// ─── Stripe checkout action ──────────────────────────────────────────────────
// Uncomment and fill in once Stripe is wired up:
//
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//
// export async function action({ request, params }: Route.ActionArgs) {
//   const user = await getUser();
//   if (!user) return redirect("/sign-in");
//
//   const trip = await getTripById(params.tripId);
//   if (!trip) throw new Response("Not Found", { status: 404 });
//
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     customer_email: user.email,
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: trip.name,
//             images: [trip.imageUrls?.[0]].filter(Boolean),
//           },
//           unit_amount: Math.round((trip.estimatedPrice ?? 0) * 100),
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${process.env.APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&tripId=${params.tripId}`,
//     cancel_url: `${process.env.APP_URL}/travel/${params.tripId}`,
//   });
//
//   return redirect(session.url!);
// }

export const meta: MetaFunction = ({ data }) => [
  { title: (data as any)?.trip?.name ? `${(data as any).trip.name} — Teal Horizon` : "Trip — Teal Horizon" },
];

export async function loader({ params }: Route.LoaderArgs) {
  const [rawTrip, user] = await Promise.allSettled([
    getTripById(params.tripId),
    getUser(),
  ]);

  if (rawTrip.status === "rejected" || !rawTrip.value) {
    throw new Response("Not Found", { status: 404 });
  }

  const [trip] = mapAppwriteTrips([rawTrip.value as unknown as AppwriteTripDocument]);
  const currentUser = user.status === "fulfilled" ? user.value : null;

  return { trip, currentUser };
}

// ── helpers ──────────────────────────────────────────────────────────────────
const TAG_COLOR_MAP: Record<string, "pink" | "primary"> = {
  nature: "primary",
  culture: "primary",
  cultural: "primary",
  historical: "primary",
  relaxed: "primary",
  luxury: "primary",
  premium: "primary",
  adventure: "pink",
  hiking: "pink",
  nightlife: "pink",
  food: "pink",
  city: "pink",
  couple: "pink",
  family: "pink",
  solo: "pink",
};

function tagColor(tag: string): "pink" | "primary" {
  return TAG_COLOR_MAP[tag?.toLowerCase()] ?? "primary";
}

export default function TravelTripDetails({ loaderData }: Route.ComponentProps) {
  const { trip, currentUser } = loaderData;

  if (!trip) return null;

  const images: string[] = trip.imageUrls ?? [];
  const itinerary: any[] = trip.itinerary ?? [];
  const tags: string[] = [
    trip.travelStyle,
    trip.interests,
    trip.groupType,
    trip.budget,
  ].filter(Boolean);

  const price = trip.estimatedPrice;
  const duration = itinerary.length;

  return (
    <>
      <TripDetailNav />

      <div className="wrapper py-10 travel-detail">
        {/* ── Hero title ── */}
        <div className="mb-8">
          <h1 className="font-clash-display text-dark-100 text-4xl md:text-5xl font-bold leading-tight mb-4">
            {trip.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-dark-400 font-plus-jakarta text-sm">
            {duration > 0 && (
              <span className="flex items-center gap-1.5">
                <img src="/assets/icons/calendar.svg" alt="" className="h-4 w-4" />
                {duration} day{duration !== 1 ? "s" : ""}
              </span>
            )}
            {trip.location && (
              <span className="flex items-center gap-1.5">
                <img src="/assets/icons/location-mark.svg" alt="" className="h-4 w-4" />
                {typeof trip.location === "string"
                  ? trip.location
                  : [trip.location.city, trip.country]
                      .filter(Boolean)
                      .join(", ")}
              </span>
            )}
            {trip.rating && (
              <span className="flex items-center gap-1.5">
                <StarRating rating={trip.rating} />
                <span className="text-dark-400">{trip.rating}/5</span>
              </span>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT: images + content ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 rounded-[20px] overflow-hidden">
                <div className="col-span-2 sm:col-span-1 row-span-2 aspect-[4/3] sm:aspect-auto">
                  <img
                    src={images[0]}
                    alt={trip.name}
                    className="w-full h-full object-cover min-h-[260px]"
                  />
                </div>
                {images.slice(1, 3).map((src, i) => (
                  <div key={i} className="aspect-[4/3]">
                    <img
                      src={src}
                      alt={`${trip.name} ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Chip key={tag} variant="outline" color={tagColor(tag)}>
                    {tag}
                  </Chip>
                ))}
              </div>
            )}

            {/* About */}
            {trip.description && (
              <div className="bg-white rounded-[20px] p-7 shadow-300">
                <h2 className="font-clash-display text-dark-100 text-2xl font-semibold mb-4">
                  About This Trip
                </h2>
                <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed">
                  {trip.description}
                </p>
              </div>
            )}

            {/* Day-by-day itinerary */}
            {itinerary.length > 0 && (
              <div className="bg-white rounded-[20px] p-7 shadow-300">
                <h2 className="font-clash-display text-dark-100 text-2xl font-semibold mb-6">
                  Day-by-Day Itinerary
                </h2>
                <ol className="flex flex-col gap-6">
                  {itinerary.map((day: any, idx: number) => (
                    <li key={idx} className="flex gap-4">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center">
                          <span className="font-clash-display text-primary-100 text-xs font-bold">
                            {idx + 1}
                          </span>
                        </div>
                        {idx < itinerary.length - 1 && (
                          <div className="w-px flex-1 bg-light-300 min-h-[24px]" />
                        )}
                      </div>

                      <div className="pb-2 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-clash-display text-dark-100 text-base font-semibold">
                            {day.title ?? `Day ${idx + 1}`}
                          </h3>
                          {day.location && (
                            <span className="font-plus-jakarta text-gray-100 text-xs flex items-center gap-1 flex-shrink-0">
                              <img
                                src="/assets/icons/location-mark.svg"
                                alt=""
                                className="h-3 w-3"
                              />
                              {day.location}
                            </span>
                          )}
                        </div>
                        {day.description && (
                          <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed">
                            {day.description}
                          </p>
                        )}
                        {Array.isArray(day.activities) && day.activities.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-1">
                            {day.activities.map((act: Activity, ai: number) => (
                              <li
                                key={ai}
                                className="flex items-start gap-2 font-plus-jakarta text-dark-400 text-xs"
                              >
                                <img
                                  src="/assets/icons/blue-check.svg"
                                  alt=""
                                  className="h-3.5 w-3.5 mt-0.5 flex-shrink-0"
                                />
                                <span className="font-semibold text-dark-100 mr-1">{act.time}</span>
                                {act.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
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
                    ${price?.toLocaleString?.() ?? price}
                  </p>
                  <p className="font-plus-jakarta text-gray-100 text-xs">per person</p>
                </div>
                {trip.rating && (
                  <div className="flex flex-col items-end gap-1">
                    <StarRating rating={trip.rating} />
                    <span className="font-plus-jakarta text-gray-100 text-xs">
                      {trip.rating}/5
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-light-300" />

              {/* Trip summary pills */}
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
                // When Stripe is live: change this to a <form method="post"> with action pointing here
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold py-3 rounded-lg text-sm transition-colors"
                    // onClick={() => { /* submit Stripe form */ }}
                    disabled
                    title="Payments coming soon"
                  >
                    Book This Trip
                  </Button>
                  <p className="font-plus-jakarta text-gray-100 text-xs text-center">
                    🔒 Secure checkout via Stripe — coming soon
                  </p>
                </div>
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