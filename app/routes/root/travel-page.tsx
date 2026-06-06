import type { MetaFunction } from "react-router";
import type { Route } from ".react-router/types/app/routes/root/+types/travel-page";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import LandingHero from "~/components/LandingHero";
import FeaturedDestinations from "~/components/FeaturedDestinations";
import HowItWorks from "~/components/HowItWorks";
import PopularTrips from "~/components/PopularTrips";
import Testimonials from "~/components/Testimonials";
import CTABanner from "~/components/CTABanner";

export const meta: MetaFunction = () => [
  { title: "Teal Horizon — AI Travel Itineraries" },
  { name: "description", content: "Plan your perfect journey with AI-powered travel itineraries." },
];

export async function loader() {
  const { allTrips = [] } = await getAllTrips(8, 0).catch(() => ({ allTrips: [] }));
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
