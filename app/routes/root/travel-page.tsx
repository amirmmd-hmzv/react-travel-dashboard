import { Link, type MetaFunction } from "react-router";
import type { Route } from ".react-router/types/app/routes/root/+types/travel-page";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import { getUser } from "lib/appwrite/auth";
import TripCard from "~/components/TripCard";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => [
  { title: "Teal Horizon — AI Travel Itineraries" },
  { name: "description", content: "Plan your perfect journey with AI-powered travel itineraries." },
];

export async function loader({ request }: Route.LoaderArgs) {
  const [tripsRaw, user] = await Promise.allSettled([
    getAllTrips(8, 0),
    getUser(),
  ]);

  const allTrips =
    tripsRaw.status === "fulfilled"
      ? mapAppwriteTrips(tripsRaw.value.allTrips ?? [])
      : [];

  const currentUser =
    user.status === "fulfilled" ? user.value : null;

  const featured = allTrips.slice(0, 3);
  const popular = allTrips.slice(3);

  return { featured, popular, currentUser };
}

const getLocationString = (trip: any) =>
  trip.itinerary?.[0]?.location ?? trip.location?.city ?? "";

const getPrice = (trip: any) => trip.estimatedPrice ?? "";

const STATS = [
  { value: "10K+", label: "Trips Created" },
  { value: "190+", label: "Countries Covered" },
  { value: "4.9★", label: "Avg. Rating" },
  { value: "AI", label: "Powered Planning" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "/assets/icons/magic-star.svg",
    title: "Describe Your Dream",
    description:
      "Tell our AI where you want to go, your budget, travel style, and who you're travelling with.",
  },
  {
    step: "02",
    icon: "/assets/icons/itinerary.svg",
    title: "AI Builds Your Plan",
    description:
      "Gemini AI crafts a full day-by-day itinerary with curated activities, restaurants, and tips.",
  },
  {
    step: "03",
    icon: "/assets/icons/destination.svg",
    title: "Pack & Explore",
    description:
      "Download your personalised itinerary and set off — everything you need, in one place.",
  },
];

const TESTIMONIALS = [
  {
    name: "James Carter",
    role: "Adventure Traveller",
    avatar: "/assets/images/james.webp",
    quote:
      "Teal Horizon planned my entire Costa Rica trip in under two minutes. The itinerary was spot-on — we didn't miss a single highlight.",
  },
  {
    name: "David Osei",
    role: "Digital Nomad",
    avatar: "/assets/images/david.webp",
    quote:
      "As someone who travels every month, having an AI that understands my budget and pace is a total game-changer.",
  },
  {
    name: "Michael Reyes",
    role: "Family Traveller",
    avatar: "/assets/images/michael.webp",
    quote:
      "Planned our family holiday to Japan with four kids — it handled everything from bullet trains to kid-friendly restaurants.",
  },
];

export default function TravelPage({ loaderData }: Route.ComponentProps) {
  const { featured, popular, currentUser } = loaderData;

  return (
    <div className="min-h-screen bg-light-200">
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-light-300">
        <div className="wrapper flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/icons/logo.svg" alt="Teal Horizon" className="h-8 w-8" />
            <span className="font-clash-display text-xl font-semibold text-dark-100">
              Teal Horizon
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/trips"
              className="hidden sm:block text-dark-400 font-plus-jakarta text-sm hover:text-primary-100 transition-colors"
            >
              Browse Trips
            </Link>
            {currentUser ? (
              <Link to="/dashboard">
                <Button className="bg-primary-100 hover:bg-primary-500 text-white rounded-lg text-sm px-4 py-2">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/sign-in">
                <Button className="bg-primary-100 hover:bg-primary-500 text-white rounded-lg text-sm px-4 py-2">
                  Get Started Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-hero bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-100/80 via-dark-100/60 to-primary-100/40" />

        <div className="relative wrapper flex flex-col items-center text-center py-28 lg:py-40 gap-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-plus-jakarta px-4 py-1.5 rounded-full">
            <img src="/assets/icons/magic-star.svg" alt="" className="h-3.5 w-3.5" />
            Powered by Gemini AI
          </span>

          <h1 className="font-clash-display text-white text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-[1.1]">
            Plan Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-500 to-primary-100">
              Journey
            </span>{" "}
            with AI
          </h1>

          <p className="font-plus-jakarta text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
            Describe your dream destination and let our AI build a personalised,
            day-by-day itinerary in seconds — with photos, weather, and local tips included.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/sign-in">
              <Button className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base shadow-500 transition-all">
                Get Started Free
              </Button>
            </Link>
            <Link to="/trips">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base transition-all"
              >
                Browse Trips
              </Button>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 pt-8 border-t border-white/20 w-full max-w-2xl">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="font-clash-display text-white text-2xl font-bold">{s.value}</span>
                <span className="font-plus-jakarta text-white/60 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED DESTINATIONS ─── */}
      {featured.length > 0 && (
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
                    className={`group relative rounded-[20px] overflow-hidden shadow-300 bg-white cursor-pointer ${featured.length === 1 || trip === featured[0] ? "md:min-h-[420px]" : "md:min-h-[340px]"} min-h-[280px]`}
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
                        From {getPrice(trip)}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-white">
        <div className="wrapper">
          <div className="text-center mb-14">
            <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
              Simple & Fast
            </p>
            <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
              How Teal Horizon Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center shadow-300">
                    <img src={step.icon} alt="" className="h-8 w-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 font-clash-display text-xs font-bold text-primary-100 bg-white border border-light-300 rounded-full w-6 h-6 flex items-center justify-center shadow-300">
                    {step.step.slice(1)}
                  </span>
                </div>
                <h3 className="font-clash-display text-dark-100 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR TRIPS ─── */}
      {popular.length > 0 && (
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
                  price={getPrice(trip)}
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
      )}

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-white">
        <div className="wrapper">
          <div className="text-center mb-14">
            <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
              Real Travellers
            </p>
            <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
              What Our Explorers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-light-200 rounded-[20px] p-7 shadow-300 flex flex-col gap-5"
              >
                <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0ea5a4&color=fff`;
                    }}
                  />
                  <div>
                    <p className="font-plus-jakarta text-dark-100 text-sm font-semibold">{t.name}</p>
                    <p className="font-plus-jakarta text-gray-100 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20">
        <div className="wrapper">
          <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-primary-100 to-navy-500 p-12 md:p-16 text-center shadow-500">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="font-clash-display text-white text-4xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">
                Your next adventure starts here
              </h2>
              <p className="font-plus-jakarta text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Sign in with Google and create your first AI-powered itinerary in under 60 seconds. Free forever.
              </p>
              <Link to="/sign-in">
                <Button className="bg-white text-primary-100 hover:bg-light-200 font-plus-jakarta font-bold px-10 py-3 rounded-lg text-base shadow-500 transition-all">
                  <img src="/assets/icons/google.svg" alt="" className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-dark-100 text-white py-12">
        <div className="wrapper flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/assets/icons/logo.svg" alt="Teal Horizon" className="h-7 w-7" />
            <span className="font-clash-display text-lg font-semibold">Teal Horizon</span>
          </div>

          <p className="font-plus-jakarta text-white/40 text-sm text-center">
            © {new Date().getFullYear()} Teal Horizon. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm font-plus-jakarta text-white/60">
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}