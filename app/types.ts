// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Activity {
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

export interface TripLocation {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  interests: string;
  groupType: string;
  country: string;
  imageUrls: string[];
  itinerary: DayPlan[];
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: TripLocation;
  payment_link: string;
  rating?: number;
}

export interface Country {
  name: string;
  coordinates: [number, number];
  value: string;
  openStreetMap?: string;
  flag: string;
  cca3: string;
}

export interface DashboardStats {
  totalUsers: number;
  usersJoined: {
    currentMonth: number;
    lastMonth: number;
  };
  userRole: {
    total: number;
    currentMonth: number;
    lastMonth: number;
  };
  totalTrips: number;
  tripsCreated: {
    currentMonth: number;
    lastMonth: number;
  };
}

export interface TrendResult {
  trend: "increment" | "decrement" | "no change";
  percentage: number;
}

export interface TripFormData {
  country: string;
  travelStyle: string;
  interest: string;
  cca3Country: string;
  budget: string;
  duration: number;
  groupType: string;
}

export interface CreateTripResponse {
  id?: string;
}

export interface UsersItineraryCount {
  imageUrl: string;
  name: string;
  count: number;
}
