import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import type { Route } from ".react-router/types/app/routes/root/+types/travel-page";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import { getUser } from "lib/appwrite/auth";
import LandingNav from "~/components/LandingNav";
import LandingHero from "~/components/LandingHero";
import FeaturedDestinations from "~/components/FeaturedDestinations";
import HowItWorks from "~/components/HowItWorks";
import PopularTrips from "~/components/PopularTrips";
import Testimonials from "~/components/Testimonials";
import CTABanner from "~/components/CTABanner";
import LandingFooter from "~/components/LandingFooter";

export const meta: MetaFunction = () => [
  { title: "Teal Horizon — AI Travel Itineraries" },
  { name: "description", content: "Plan your perfect journey with AI-powered travel itineraries." },
];

export async function loader() {
  const { allTrips = [] } = await getAllTrips(8, 0).catch(() => ({ allTrips: [] }));
  const trips = mapAppwriteTrips(allTrips);
  return { featured: trips.slice(0, 3), popular: trips.slice(3) };
}

function useCurrentUser() {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let active = true;
    getUser()
      .then((result) => { if (active && result && typeof result === "object" && "name" in result) setUser(result); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  return user;
}

export default function TravelPage({ loaderData }: Route.ComponentProps) {
  const { featured, popular } = loaderData;
  const currentUser = useCurrentUser();

  return (
    <div className="min-h-screen bg-light-200">
      <LandingNav currentUser={currentUser} />
      <LandingHero currentUser={currentUser} />
      <FeaturedDestinations featured={featured} />
      <HowItWorks />
      <PopularTrips popular={popular} />
      <Testimonials />
      <CTABanner currentUser={currentUser} />
      <LandingFooter />
    </div>
  );
}
