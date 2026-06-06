import { cn } from "lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
  starSize?: string;
}

function StarImage({
  type,
  className,
}: {
  type: "full" | "half" | "empty";
  className?: string;
}) {
  if (type === "half") {
    return (
      <span className="relative inline-block">
        <img
          src="/assets/icons/star-empty.svg"
          alt=""
          className={className}
        />
        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <img
            src="/assets/icons/star.svg"
            alt=""
            className={className}
          />
        </span>
      </span>
    );
  }

  return (
    <img
      src={
        type === "full"
          ? "/assets/icons/star.svg"
          : "/assets/icons/star-empty.svg"
      }
      alt=""
      className={className}
    />
  );
}

const StarRating = ({ rating, className, starSize = "size-4.5" }: StarRatingProps) => {
  return (
    <ul className={cn("flex gap-1 items-center", className)}>
      {Array.from({ length: 5 }, (_, i) => {
        const position = i + 1;
        let type: "full" | "half" | "empty";
        if (rating >= position) {
          type = "full";
        } else if (rating >= position - 0.5) {
          type = "half";
        } else {
          type = "empty";
        }
        return (
          <li key={i}>
            <StarImage type={type} className={starSize} />
          </li>
        );
      })}
    </ul>
  );
};

export default StarRating;
