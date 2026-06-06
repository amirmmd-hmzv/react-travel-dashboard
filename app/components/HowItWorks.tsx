const STEPS = [
  {
    step: "01",
    icon: "/assets/icons/magic-star.svg",
    title: "Describe Your Dream",
    description:
      "Tell our AI where you want to go, your budget, travel style, and who you're travelling with.",
  },
  {
    step: "02",
    icon: "/assets/icons/itinerary.svg",
    title: "AI Builds Your Plan",
    description:
      "Gemini AI crafts a full day-by-day itinerary with curated activities, restaurants, and tips.",
  },
  {
    step: "03",
    icon: "/assets/icons/destination.svg",
    title: "Pack & Explore",
    description:
      "Download your personalised itinerary and set off — everything you need, in one place.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="wrapper">
        <div className="text-center mb-14">
          <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
            Simple & Fast
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
