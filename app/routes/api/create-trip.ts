import { type ActionFunctionArgs, data } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { appwriteConfig } from "lib/appwrite/client";
import { createServerDocument, requireAdminUser } from "lib/appwrite/server";
import { parseMarkdownToJson } from "lib/utils";

interface ActionBody {
  country?: string;
  numberOfDays?: number;
  travelStyle?: string;
  interests?: string;
  budget?: string;
  groupType?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const adminUser = await requireAdminUser(request);
  if (!adminUser) {
    return data({ error: "Admin access required." }, { status: 403 });
  }

  const body: ActionBody = await request.json();
  const { country, numberOfDays, travelStyle, interests, budget, groupType } =
    body;

  if (
    !country ||
    !numberOfDays ||
    !travelStyle ||
    !interests ||
    !budget ||
    !groupType
  ) {
    return data({ error: "All fields are required." }, { status: 400 });
  }

  if (numberOfDays < 1 || numberOfDays > 10) {
    return data(
      { error: "Duration must be between 1 and 10 days." },
      { status: 400 },
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "rating": "Overall rating from 1.0 to 5.0 based on the trip quality, e.g. 4.7",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "interests": "${interests}",
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;

    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.5-flash" })
      .generateContent([prompt]);

    const trip = parseMarkdownToJson(textResult.response.text());

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`,
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: { urls?: { regular?: string } }) => result.urls?.regular || null);

    const result = await createServerDocument(
      request,
      appwriteConfig.tripsCollections,
      {
        tripDetail: JSON.stringify(trip),
        imageUrls,
        userId: adminUser.accountId,
      },
    );

    return data({ id: result.$id });
  } catch (e) {
    console.error("Error generating travel plan: ", e);
    return data(
      { error: "Failed to generate travel plan. Please try again." },
      { status: 500 },
    );
  }
};
