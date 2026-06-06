const STEPS = [
  {
    step: "01",
    icon: "/assets/icons/magic-star.svg",
    title: "Expert Curation",
    description:
      "Our team uses AI to craft detailed day-by-day itineraries tailored to every travel style and budget.",
  },
  {
    step: "02",
    icon: "/assets/icons/itinerary.svg",
    title: "Browse & Compare",
    description:
      "Explore trips by destination, style, budget, and duration. Find the perfect match for your next getaway.",
  },
  {
    step: "03",
    icon: "/assets/icons/destination.svg",
    title: "Book Your Adventure",
    description:
      "Purchase your chosen itinerary via secure checkout and get ready to explore.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="wrapper">
        <div className="text-center mb-14">
          <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
            How Teal Horizon Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.step} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center shadow-300">
                  <img src={step.icon} alt="" className="h-8 w-8" />
                </div>
                <span className="absolute -top-2 -right-2 font-clash-display text-xs font-bold text-primary-100 bg-white border border-light-300 rounded-full w-6 h-6 flex items-center justify-center shadow-300">
                  {step.step.slice(1)}
                </span>
              </div>
              <h3 className="font-clash-display text-dark-100 text-xl font-semibold">
                {step.title}
              </h3>
              <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
