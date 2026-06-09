import { useId } from "react";
import { cn } from "lib/utils";

const STAR_PATH =
  "M4.57396 18.2578L9.3326 15.7735L14.0912 18.2578C14.7762 18.6154 15.5742 18.0332 15.4427 17.2718L14.5353 12.0184L18.38 8.29682C18.9372 7.75755 18.6317 6.81348 17.8643 6.70274L12.5456 5.93527L10.1683 1.15164C9.8251 0.461171 8.84011 0.461171 8.49695 1.15164L6.11957 5.93527L0.800908 6.70274C0.0334911 6.81348 -0.271953 7.75755 0.285159 8.29682L4.12988 12.0184L3.22255 17.2718C3.09104 18.0332 3.88899 18.6154 4.57396 18.2578Z";

const FILLED = "#FFC542";
const EMPTY = "#E5E7EB";

interface StarRatingProps {
  rating: number;
  className?: string;
  starSize?: string;
}

function StarSvg({
  type,
  className,
  clipId,
}: {
  type: "full" | "half" | "empty";
  className?: string;
  clipId: string;
}) {
  if (type === "half") {
    return (
      <svg
        className={className}
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="9.5" height="19" />
          </clipPath>
        </defs>
        <path d={STAR_PATH} fill={EMPTY} />
        <path d={STAR_PATH} fill={FILLED} clipPath={`url(#${clipId})`} />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={STAR_PATH} fill={type === "full" ? FILLED : EMPTY} />
    </svg>
  );
}

const StarRating = ({ rating, className, starSize = "size-4.5" }: StarRatingProps) => {
  const uid = useId();

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
            <StarSvg type={type} className={starSize} clipId={`${uid}-${i}`} />
          </li>
        );
      })}
    </ul>
  );
};

export default StarRating;
