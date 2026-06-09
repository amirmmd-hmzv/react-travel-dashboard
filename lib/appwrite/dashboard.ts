import { Query } from "node-appwrite";
import { parseTripData } from "lib/utils";
import { appwriteConfig } from "./client";
import { listAdminDocuments } from "./server";
import type { DashboardStats } from "app/types";

function monthBoundaries() {
  const d = new Date();
  const startCurrent = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  const startPrev = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString();
  const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();
  return { startCurrent, startPrev, endPrev };
}

async function countDocuments(
  collectionId: string,
  queries: string[] = [],
): Promise<number> {
  const result = await listAdminDocuments(collectionId, [
    ...queries,
    Query.limit(1),
  ]);
  return result.total;
}

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
  const { startCurrent, startPrev, endPrev } = monthBoundaries();

  const [
    totalUsers,
    totalTrips,
    usersJoinedCurrent,
    usersJoinedLast,
    roleTotal,
    roleCurrent,
    roleLast,
    tripsCurrent,
    tripsLast,
  ] = await Promise.all([
    countDocuments(appwriteConfig.usersCollections),
    countDocuments(appwriteConfig.tripsCollections),
    countDocuments(appwriteConfig.usersCollections, [
      Query.greaterThanEqual("joinedAt", startCurrent),
    ]),
    countDocuments(appwriteConfig.usersCollections, [
      Query.greaterThanEqual("joinedAt", startPrev),
      Query.lessThanEqual("joinedAt", endPrev),
    ]),
    countDocuments(appwriteConfig.usersCollections, [
      Query.equal("status", "user"),
    ]),
    countDocuments(appwriteConfig.usersCollections, [
      Query.equal("status", "user"),
      Query.greaterThanEqual("joinedAt", startCurrent),
    ]),
    countDocuments(appwriteConfig.usersCollections, [
      Query.equal("status", "user"),
      Query.greaterThanEqual("joinedAt", startPrev),
      Query.lessThanEqual("joinedAt", endPrev),
    ]),
    countDocuments(appwriteConfig.tripsCollections, [
      Query.greaterThanEqual("$createdAt", startCurrent),
    ]),
    countDocuments(appwriteConfig.tripsCollections, [
      Query.greaterThanEqual("$createdAt", startPrev),
      Query.lessThanEqual("$createdAt", endPrev),
    ]),
  ]);

  return {
    totalUsers,
    usersJoined: {
      currentMonth: usersJoinedCurrent,
      lastMonth: usersJoinedLast,
    },
    userRole: {
      total: roleTotal,
      currentMonth: roleCurrent,
      lastMonth: roleLast,
    },
    totalTrips,
    tripsCreated: {
      currentMonth: tripsCurrent,
      lastMonth: tripsLast,
    },
  };
};

export const getUserGrowthPerDay = async () => {
  const users = await listAdminDocuments(appwriteConfig.usersCollections, [
    Query.orderDesc("joinedAt"),
    Query.limit(100),
  ]);

  const userGrowth = users.documents.reduce(
    (acc: Record<string, number>, user) => {
      const day = new Date(user.joinedAt as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsCreatedPerDay = async () => {
  const trips = await listAdminDocuments(appwriteConfig.tripsCollections, [
    Query.orderDesc("$createdAt"),
    Query.limit(100),
  ]);

  const tripsGrowth = trips.documents.reduce(
    (acc: Record<string, number>, trip) => {
      const day = new Date(trip.$createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(tripsGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsByTravelStyle = async () => {
  const trips = await listAdminDocuments(appwriteConfig.tripsCollections, [
    Query.orderDesc("$createdAt"),
    Query.limit(200),
  ]);

  const travelStyleCounts = trips.documents.reduce(
    (acc: Record<string, number>, trip) => {
      const tripDetail = parseTripData(trip.tripDetail as string);
      if (tripDetail?.travelStyle) {
        acc[tripDetail.travelStyle] = (acc[tripDetail.travelStyle] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
    count: Number(count),
    travelStyle,
  }));
};
