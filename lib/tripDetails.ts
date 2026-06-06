import { getFirstWord } from "./utils";

export const PILL_COLORS = {
  travelStyle: "!bg-pink-50 !text-pink-500",
  groupType: "!bg-primary-50 !text-primary-500",
  budget: "!bg-success-50 !text-success-700",
  interests: "!bg-navy-50 !text-navy-500",
} as const;

export type PillKey = keyof typeof PILL_COLORS;

export function getPillItems(trip: Record<string, any>) {
  return (Object.keys(PILL_COLORS) as PillKey[])
    .filter((key) => trip[key])
    .map((key) => ({
      text: getFirstWord(trip[key]),
      bg: PILL_COLORS[key],
    }));
}

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

export function tagColor(tag: string): "pink" | "primary" {
  return TAG_COLOR_MAP[tag?.toLowerCase()] ?? "primary";
}
