import { Skeleton } from "~/components/ui/skeleton";

export default function TripCardSkeleton() {
  return (
    <div className="trip-card">
      <Skeleton className="w-full rounded-t-xl aspect-square max-h-50" />
      <article>
        <Skeleton className="h-5 w-3/4" />
        <figure>
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </figure>
      </article>
      <div className="mt-4 pt-3.5 pl-3.5 pb-4 flex gap-1.5 border-b border-light-300">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 pl-3.5 pb-4">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
