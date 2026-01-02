import { calculateTrendPercentage, cn } from "lib/utils";
import { useMemo } from "react";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

const StatsCard = ({
  headTitle,
  currentMonthCount,
  lastMonthCount,
  total,
}: StatsCard) => {
  const { percentage, trend } = useMemo(() => {
    return calculateTrendPercentage(currentMonthCount, lastMonthCount);
  }, [currentMonthCount, lastMonthCount]);

  const isIncrement = trend == "increment";

  return (
    <article className="stats-card  border-pink-10 shadow-pink-5">
      <h3 className="font-medium text-base">{headTitle}</h3>

      <div className="content">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-wider ">{total}</h2>

          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              {isIncrement ? (
                <LuArrowUp className="text-navy-500" />
              ) : (
                <LuArrowDown className="text-pink-500" />
              )}
              <figcaption
                className={cn(
                  "text-base",
                  isIncrement ? "text-navy-500" : "text-pink-500"
                )}
              >
                {Math.round(percentage)}%
              </figcaption>
              <span className="text-sm font-medium text-gray-100 pl-1">
                via last month
              </span>
            </figure>
          </div>
        </div>
        <img src={`/assets/icons/${trend}.svg`} alt="" />
        {/* must chnage with chart js */}
      </div>
    </article>
  );
};

export default StatsCard;
