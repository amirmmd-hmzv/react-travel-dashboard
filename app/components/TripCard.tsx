import { LuMap } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import Chip from "./ui/Cheap";
import { getFirstWord } from "lib/utils";

const TripCard = ({
  id,
  imageUrl,
  location,
  name,
  price,
  tags,
}: TripCardProps) => {
  console.log(tags);
  const path = useLocation();
  return (
    <Link
      className="trip-card"
      to={
        path.pathname == "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
    >
      <img src={imageUrl} alt={name} />

      <article>
        <h2 className="text-primary-100">{name}</h2>
        <figure>
          <LuMap className="text-gray-100" />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-4 pt-3.5 pl-3.5 pb-4 flex gap-1.5">
        {tags.map((tag, index) => (
          <Chip
            key={`tag-${index}`}
            variant="outline"
            color={index % 2 == 0 ? "pink" : "primary"}
          >
            {getFirstWord(tag)}
          </Chip>
        ))}
      </div>
    </Link>
  );
};

export default TripCard;
