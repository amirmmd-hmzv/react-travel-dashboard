import { LuPlus } from "react-icons/lu";
import { type LoaderFunctionArgs } from "react-router";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";
import { Header, AsyncTripGrid } from "~/components";
import { useNavigation } from "react-router";
import AppPagination from "~/components/AppPagination";
import type { Route } from "./+types/trips";
import type { Trip } from "~/types";

const LIMIT = 8;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * LIMIT;

  const { allTrips, total } = await getAllTrips(LIMIT, offset);

  return {
    trips: mapAppwriteTrips(allTrips),
    total,
    currentPage: page,
  };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData?.trips as Trip[] | [];
  const total: number = loaderData?.total ?? 0;
  const currentPage: number = loaderData?.currentPage ?? 1;
  const totalPages = Math.ceil(total / LIMIT);
  const isLoading = useNavigation().state === "loading";

  return (
    <main className="dashboard wrapper">
      <Header
        title="Explore Your Trips"
        description="View, edit, and optimize AI-generated travel itineraries all in one place."
        ctaUrl="/admin/trips/create"
        ctaText="Create New Trip"
        icon={<LuPlus className="size-6" />}
      />

      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>

        <AsyncTripGrid loading={isLoading} trips={trips} skeletonCount={LIMIT} />

        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          className="mb-4"
        />
      </section>
    </main>
  );
};

export default Trips;