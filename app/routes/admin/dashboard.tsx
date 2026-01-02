import { getUser } from "lib/appwrite/auth";
import { Header, StatsCard, TripCard } from "~/components";
import { dashboardStats, user, allTrips, users } from "~/constants";
import type { Route } from "./+types/dashboard";

export async function clientLoader() {
  const user = await getUser();

  return user;
}

const Dashboard = ({ loaderData }: Route.ComponentProps) => {

  const user = loaderData as User | null;

  const { totalTrips, totalUsers, tripsCreated, userRole, usersJoined } =
    dashboardStats;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Wellcome  ${user?.name ?? "Guest"} 👋 `}
        description={"Let's plan your next adventure"}
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            headTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />

          <StatsCard
            headTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />

          <StatsCard
            headTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Trips</h1>

        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(
              ({
                id,
                estimatedPrice,
                imageUrls,
                itinerary,
                name,
                tags,
                travelStyle,
              }) => {
                return (
                  <TripCard
                    key={id}
                    id={id.toString()}
                    name={name}
                    tags={tags}
                    imageUrl={imageUrls[0]}
                    price={estimatedPrice}
                    location={itinerary?.[0]?.location ?? ""}
                  />
                );
              }
            )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
