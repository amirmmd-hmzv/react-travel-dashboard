import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/useCurrentUser";
import { Section } from "~/components";

const CTABanner = () => {
  const { user: currentUser } = useUser();

  return (
    <Section>
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-primary-100 to-navy-500 p-12 md:p-16 text-center shadow-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="font-clash-display text-white text-4xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">
              {currentUser ? "Ready to explore?" : "Find your next adventure"}
            </h2>
            <p className="font-plus-jakarta text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {currentUser
                ? "Browse new AI-crafted trips or pick up where you left off."
                : "Browse AI-crafted itineraries and book your perfect trip today."}
            </p>
            <Link to="/trips">
              <Button className="bg-white text-primary-100 hover:bg-light-200 font-plus-jakarta font-bold px-10 py-3 rounded-lg text-base shadow-500 transition-all">
                Browse All Trips
              </Button>
            </Link>
          </div>
        </div>
    </Section>
  );
};

export default CTABanner;
