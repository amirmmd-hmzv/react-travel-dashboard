import { cn, getFirstWord } from "lib/utils";
import { InfoPill, StarRating } from "~/components";
import Chip from "~/components/ui/Cheap";

interface TripDetailsBodyProps {
  tripData: Trip;
  imageUrls: string[];
}

const TripDetailsBody = ({ tripData, imageUrls }: TripDetailsBodyProps) => {
  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
    rating = 0,
  } = tripData;

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: bestTimeToVisit },
    { title: "Weather:", items: weatherInfo },
  ];

  return (
    <section className="container wrapper-md">
      <header>
        <h1 className="p-40-semibold text-dark-100">{name}</h1>
        <div className="flex items-center gap-5">
          <InfoPill
            text={`${duration} day plan`}
            image="/assets/icons/calendar.svg"
          />
          <InfoPill
            text={
              itinerary
                ?.slice(0, 4)
                .map((item) => item.location)
                .join(", ") || ""
            }
            image="/assets/icons/location-mark.svg"
          />
        </div>
      </header>

      <section className="gallery">
        {imageUrls.map((url, i) => (
          <img
            src={url}
            key={i}
            alt={`${name} ${i + 1}`}
            className={cn(
              "w-full rounded-xl object-cover",
              i === 0
                ? "md:col-span-2 md:row-span-2 h-82.5"
                : "md:row-span-1 h-37.5",
            )}
          />
        ))}
      </section>

      <section className="flex gap-3 md:gap-5 items-center flex-wrap">
        {pillItems.map((pill, i) => (
          <Chip
            key={i}
            variant="custom"
            className={`${pill.bg} !text-base !font-medium !px-4`}
          >
            {getFirstWord(pill.text)}
          </Chip>
        ))}

        <StarRating rating={rating} />
        <span className="ml-1">
          <Chip className="!bg-yellow-50 !text-yellow-700 !border-yellow-100">
            {rating.toFixed(1)}/5
          </Chip>
        </span>
      </section>

      <section className="title">
        <article>
          <h3>
            {duration}-Day {country} {travelStyle} Trip
          </h3>
          <p>
            {budget}, {groupType} and {interests}
          </p>
        </article>
        <h2>{estimatedPrice}</h2>
      </section>

      <p className="text-sm md:text-lg font-normal text-dark-400">
        {description}
      </p>

      <ul className="itinerary">
        {itinerary?.map((dayPlan, index) => (
          <li key={index}>
            <h3>
              Day {dayPlan.day}: {dayPlan.location}
            </h3>
            <ul>
              {dayPlan.activities.map((activity, activityIndex) => (
                <li key={activityIndex}>
                  <span className="flex-shring-0 p-18-semibold">
                    {activity.time}
                  </span>
                  <p className="grow">{activity.description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {visitTimeAndWeatherInfo.map((section) => (
        <section key={section.title} className="visit">
          <div>
            <h3>{section.title}</h3>
            <ul>
              {section.items?.map((item) => (
                <li key={item}>
                  <p className="flex-grow">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </section>
  );
};

export default TripDetailsBody;
