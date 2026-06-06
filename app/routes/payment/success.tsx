import { Link, useSearchParams } from "react-router";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("sessionId") ?? "";
  const tripId = params.get("tripId") ?? "";

  return (
    <div className="payment-success">
      <section>
        <img src="/assets/icons/check.svg" alt="" className="h-16 w-16" />
        <article>
          <h1>Trip Booked Successfully!</h1>
          <p>
            Your booking has been confirmed. Get ready for an amazing adventure!
          </p>
        </article>
      </section>

      <section>
        <article>
          {sessionId && (
            <p className="font-plus-jakarta text-gray-100 text-xs">
              Confirmation: {sessionId.slice(0, 20)}...
            </p>
          )}
        </article>
        <div className="flex gap-3 mt-2">
          <Link
            to="/my-bookings"
            className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-7 py-3 rounded-lg text-sm transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to={tripId ? `/travel/${tripId}` : "/trips"}
            className="bg-white border border-light-300 hover:border-primary-100 text-dark-400 hover:text-primary-100 font-plus-jakarta font-semibold px-7 py-3 rounded-lg text-sm transition-colors"
          >
            {tripId ? "Back to Trip" : "Browse Trips"}
          </Link>
        </div>
      </section>
    </div>
  );
}
