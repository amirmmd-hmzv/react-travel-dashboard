import { getAllUsersWithTripCount } from "lib/appwrite/auth";
import { useUser } from "lib/useCurrentUser";
import { Header, StatsCard, TripCard, TripCardSkeleton } from "~/components";
import { useNavigation } from "react-router";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "lib/appwrite/dashboard";
import { getAllTrips, mapAppwriteTrips } from "lib/appwrite/trips";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// shadcn chart + recharts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// ─── chart configs ────────────────────────────────────────────────────────────

const userGrowthChartConfig = {
  count: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const tripTrendsChartConfig = {
  count: {
    label: "Trips",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// ─── loaders ─────────────────────────────────────────────────────────────────

export async function loader() {
  const [
    dashboardStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    getUsersAndTripsStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsByTravelStyle(),
    getAllUsersWithTripCount(4, 0),
  ]);

  const allTrips = mapAppwriteTrips(trips.allTrips);

  const mappedUsers =
    allUsers?.users.map((user: any) => ({
      imageUrl: user.imageUrl,
      name: user.name,
      count: user.tripCount,
    })) || [];

  return {
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
}



// ─── component ───────────────────────────────────────────────────────────────

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const navigation = useNavigation();
  const currentUser = useUser();
  const isLoading = navigation.state === "loading";
  const user = currentUser as { name?: string } | null;
  const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  const { totalTrips, totalUsers, tripsCreated, userRole, usersJoined } =
    dashboardStats;

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));
  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips created",
    },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description={"Let's plan your next adventure"}
      />

      {/* ── Stats ── */}
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

      {/* ── Trips ── */}
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Trips</h1>
        <div className="trip-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TripCardSkeleton key={i} />)
            : allTrips.map((trip) => {
            if (!trip.name || !trip.estimatedPrice || !trip.imageUrls?.[0]) {
              return null;
            }
            return (
              <TripCard
                key={trip.id}
                id={trip.id.toString()}
                name={trip.name}
                tags={[trip.interests!, trip.travelStyle!]}
                imageUrl={trip.imageUrls[0]}
                price={trip.estimatedPrice}
                location={trip.itinerary?.[0]?.location ?? ""}
              />
            );
          })}
        </div>
      </section>

      {/* ── Charts ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Growth — Column + SplineArea overlay (matches original) */}
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-dark-100">User Growth</h3>
          <ChartContainer
            config={userGrowthChartConfig}
            className="h-80 w-full"
          >
            <AreaChart
              data={userGrowth}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(14, 165, 164)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(14, 165, 164)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgb(229, 231, 235)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(107, 114, 128)" }}
                tickMargin={8}
                label={{
                  value: "Days",
                  position: "bottom",
                  offset: 10,
                  fontSize: 13,
                  fill: "rgb(15, 23, 42)",
                }}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(107, 114, 128)" }}
                tickMargin={8}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",

                  offset: 10,
                  fontSize: 13,
                  fill: "rgb(15, 23, 42)",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* SplineArea overlay */}
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#userGradient)"
                stroke="rgb(14, 165, 164)"
                strokeWidth={3}
                dot={{ fill: "rgb(14, 165, 164)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              {/* Column bars */}
              <Bar
                dataKey="count"
                fill="rgb(14, 165, 164)"
                radius={[8, 8, 0, 0]}
                barSize={20}
                opacity={0.1}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Trip Trends — Column only (matches original) */}
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-dark-100">
            Trip Trends by Travel Style
          </h3>
          <ChartContainer
            config={tripTrendsChartConfig}
            className="h-80 w-full"
          >
            <BarChart
              data={tripsByTravelStyle}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgb(229, 231, 235)"
              />
              <XAxis
                dataKey="travelStyle"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(107, 114, 128)" }}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
                label={{
                  value: "Travel Styles",
                  position: "bottom",
                  offset: 20,
                  fontSize: 13,
                  fill: "rgb(15, 23, 42)",
                }}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(107, 114, 128)" }}
                tickMargin={8}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 13,
                  fill: "rgb(15, 23, 42)",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="rgb(45, 212, 191)"
                radius={[8, 8, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
          >
            <h3 className="text-base font-semibold text-dark-100">{title}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>{headerText}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSource?.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded-full size-8 aspect-square object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-xs font-semibold">
                            {item.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item[field]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
