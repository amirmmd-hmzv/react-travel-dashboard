import { Link } from "react-router";
import { Button } from "~/components/ui/button";

interface LandingHeroProps {
  currentUser?: Record<string, any> | null;
}

const STATS = [
  { value: "10K+", label: "Trips Created" },
  { value: "190+", label: "Countries Covered" },
  { value: "4.9★", label: "Avg. Rating" },
  { value: "AI", label: "Powered Planning" },
];

const LandingHero = ({ currentUser }: LandingHeroProps) => {
  if (currentUser) {
    return (
      <section className="relative overflow-hidden bg-hero bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-100/80 via-dark-100/60 to-primary-100/40" />
        <div className="relative wrapper flex flex-col items-center text-center py-28 lg:py-40 gap-8">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-plus-jakarta px-4 py-1.5 rounded-full">
            <img src="/assets/icons/magic-star.svg" alt="" className="h-3.5 w-3.5" />
            Welcome back, {currentUser.name?.split(" ")[0] || "Explorer"}
          </span>

          <h1 className="font-clash-display text-white text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-[1.1]">
            Ready for your next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-500 to-primary-100">
              Adventure
            </span>
            ?
          </h1>

          <p className="font-plus-jakarta text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
            Plan another unforgettable trip with AI. Your past itineraries and preferences are ready to guide you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/trips">
              <Button className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base shadow-500 transition-all">
                Browse Trips
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base transition-all"
              >
                My Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-6 pt-8 border-t border-white/20 w-full max-w-2xl">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="font-clash-display text-white text-2xl font-bold">{s.value}</span>
                <span className="font-plus-jakarta text-white/60 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-hero bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-100/80 via-dark-100/60 to-primary-100/40" />
      <div className="relative wrapper flex flex-col items-center text-center py-28 lg:py-40 gap-8">
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-plus-jakarta px-4 py-1.5 rounded-full">
          <img src="/assets/icons/magic-star.svg" alt="" className="h-3.5 w-3.5" />
          Powered by Gemini AI
        </span>

        <h1 className="font-clash-display text-white text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-[1.1]">
          Plan Your Perfect{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-500 to-primary-100">
            Journey
          </span>{" "}
          with AI
        </h1>

        <p className="font-plus-jakarta text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
          Describe your dream destination and let our AI build a personalised,
          day-by-day itinerary in seconds — with photos, weather, and local tips included.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/sign-in">
            <Button className="bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base shadow-500 transition-all">
              Get Started Free
            </Button>
          </Link>
          <Link to="/trips">
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 font-plus-jakarta font-semibold px-8 py-3 rounded-lg text-base transition-all"
            >
              Browse Trips
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-6 pt-8 border-t border-white/20 w-full max-w-2xl">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="font-clash-display text-white text-2xl font-bold">{s.value}</span>
              <span className="font-plus-jakarta text-white/60 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
