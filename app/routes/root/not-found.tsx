import { Link, isRouteErrorResponse, useRouteError } from "react-router";

interface ErrorPageProps {
  is404: boolean;
}

function ErrorPageContent({ is404 }: ErrorPageProps) {
  const title = is404 ? "Page Not Found" : "Something Went Wrong";
  const subtitle = is404
    ? "Looks like this destination doesn't exist on our map."
    : "An unexpected error occurred. Our team has been notified.";

  return (
    <div className="min-h-screen bg-light-200 flex flex-col">
      <main className="flex-1 wrapper flex flex-col items-center justify-center text-center py-24 gap-8">
        <div className="relative select-none">
          <p
            className="font-clash-display font-bold leading-none select-none pointer-events-none"
            style={{
              fontSize: "clamp(140px, 22vw, 220px)",
              color: "transparent",
              WebkitTextStroke: "2px #e2e8f0",
            }}
          >
            {is404 ? "404" : "500"}
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-[24px] bg-primary-50 flex items-center justify-center shadow-500">
                <img
                  src="/assets/icons/destination.svg"
                  alt=""
                  className="h-12 w-12 opacity-70"
                />
              </div>
              <div className="absolute -inset-3 rounded-[32px] border-2 border-primary-100/15" />
              <div className="absolute -inset-6 rounded-[40px] border border-primary-100/8" />
            </div>
          </div>
        </div>

        <div className="max-w-md flex flex-col gap-3">
          <h1 className="font-clash-display text-dark-100 text-4xl font-bold">
            {title}
          </h1>
          <p className="font-plus-jakarta text-dark-400 text-base leading-relaxed">
            {subtitle}
          </p>
          {is404 && (
            <p className="font-plus-jakarta text-gray-100 text-sm">
              The page you&apos;re looking for may have been moved, deleted, or never
              existed. Let&apos;s get you back on track.
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-7 py-3 rounded-lg text-sm transition-colors shadow-300"
            >
              Back to Home
            </Link>
            <Link
              to="/trips"
              className="bg-white border border-light-300 hover:border-primary-100 text-dark-400 hover:text-primary-100 font-plus-jakarta font-semibold px-7 py-3 rounded-lg text-sm transition-colors"
            >
              Explore Trips
            </Link>
          </div>

          <p className="font-plus-jakarta text-gray-100 text-xs">
            Or jump to:{" "}
            <Link
              to="/sign-in"
              className="text-primary-100 hover:underline"
            >
              Sign In
            </Link>
            {" · "}
            <Link
              to="/admin/dashboard"
              className="text-primary-100 hover:underline"
            >
              Dashboard
            </Link>
          </p>
        </div>

        {is404 && (
          <div className="mt-4 bg-white rounded-[20px] shadow-300 p-6 max-w-sm w-full">
            <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed">
              💡 <span className="font-semibold text-dark-100">While you&apos;re here</span> — why not
              let our AI plan your next trip? Describe a destination and get a
              full itinerary in seconds.
            </p>
            <Link to="/sign-in">
              <button className="mt-4 w-full bg-primary-50 hover:bg-primary-100 text-primary-100 hover:text-white font-plus-jakarta font-semibold py-2.5 rounded-lg text-sm transition-colors border border-primary-100/30">
                <img
                  src="/assets/icons/magic-star.svg"
                  alt=""
                  className="inline h-4 w-4 mr-1.5 -mt-0.5"
                />
                Plan a Trip with AI
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return <ErrorPageContent is404={is404} />;
}

export default function NotFound() {
  return <ErrorPageContent is404={true} />;
}
