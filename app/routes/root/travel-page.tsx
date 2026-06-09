import type { MetaFunction } from "react-router";
import type { Route } from ".react-router/types/app/routes/root/+types/travel-page";
import { getServerTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import LandingHero from "~/components/sections/LandingHero";
import FeaturedDestinations from "~/components/sections/FeaturedDestinations";
import HowItWorks from "~/components/sections/HowItWorks";
import PopularTrips from "~/components/sections/PopularTrips";
import Testimonials from "~/components/sections/Testimonials";
import CTABanner from "~/components/sections/CTABanner";

export const meta: MetaFunction = () => [
  { title: "Teal Horizon — AI Travel Itineraries" },
  { name: "description", content: "Plan your perfect journey with AI-powered travel itineraries." },
];

export async function loader() {
  const { allTrips = [] } = await getServerTrips(8, 0);
  const trips = mapAppwriteTrips(allTrips);
  return { featured: trips.slice(0, 3), popular: trips.slice(3) };
}

export default function TravelPage({ loaderData }: Route.ComponentProps) {
  const { featured, popular } = loaderData;

  return (
    <>
      <LandingHero />
      <FeaturedDestinations featured={featured} />
      <HowItWorks />
      <PopularTrips popular={popular} />
      <Testimonials />
      <CTABanner />
    </>
  );
}
