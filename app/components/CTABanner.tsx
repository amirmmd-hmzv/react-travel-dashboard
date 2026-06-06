import { Link } from "react-router";
import { Button } from "~/components/ui/button";

interface CTABannerProps {
  currentUser?: Record<string, any> | null;
}

const CTABanner = ({ currentUser }: CTABannerProps) => {
  return (
    <section className="py-20">
      <div className="wrapper">
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-primary-100 to-navy-500 p-12 md:p-16 text-center shadow-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="font-clash-display text-white text-4xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">
              {currentUser ? "Your next adventure awaits" : "Your next adventure starts here"}
            </h2>
            <p className="font-plus-jakarta text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {currentUser
                ? "Browse your saved trips or plan a brand new itinerary with AI."
                : "Sign in with Google and create your first AI-powered itinerary in under 60 seconds. Free forever."}
            </p>
            <Link to={currentUser ? "/trips" : "/sign-in"}>
              <Button className="bg-white text-primary-100 hover:bg-light-200 font-plus-jakarta font-bold px-10 py-3 rounded-lg text-base shadow-500 transition-all">
                {currentUser ? (
                  "Browse Trips"
                ) : (
                  <>
                    <img src="/assets/icons/google.svg" alt="" className="h-5 w-5 mr-2" />
                    Get Started Free
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
