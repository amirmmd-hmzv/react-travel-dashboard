import Chip from "~/components/ui/chip";
import { StarRating } from "~/components";

interface PillItem {
  text: string;
  bg: string;
}

interface TripPillsProps {
  pillItems: PillItem[];
  rating: number;
  className?: string;
}

const TripPills = ({ pillItems, rating, className = "" }: TripPillsProps) => {
  return (
    <section className={`flex gap-3 md:gap-5 items-center flex-wrap ${className}`}>
      {pillItems.map((pill, i) => (
        <Chip
          key={i}
          variant="custom"
          className={`${pill.bg} !text-base !font-medium !px-4`}
        >
          {pill.text}
        </Chip>
      ))}
      <StarRating rating={rating} />
      <span className="ml-1">
        <Chip className="!bg-yellow-50 !text-yellow-700 !border-yellow-100">
          {rating.toFixed(1)}/5
        </Chip>
      </span>
    </section>
  );
};

export default TripPills;
