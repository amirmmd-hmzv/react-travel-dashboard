const TESTIMONIALS = [
  {
    name: "James Carter",
    role: "Adventure Traveller",
    avatar: "/assets/images/james.webp",
    quote:
      "Teal Horizon planned my entire Costa Rica trip in under two minutes. The itinerary was spot-on — we didn't miss a single highlight.",
  },
  {
    name: "David Osei",
    role: "Digital Nomad",
    avatar: "/assets/images/david.webp",
    quote:
      "As someone who travels every month, having an AI that understands my budget and pace is a total game-changer.",
  },
  {
    name: "Michael Reyes",
    role: "Family Traveller",
    avatar: "/assets/images/michael.webp",
    quote:
      "Planned our family holiday to Japan with four kids — it handled everything from bullet trains to kid-friendly restaurants.",
  },
];

import { Section } from "~/components";

const Testimonials = () => {
  return (
    <Section bgWhite>
        <div className="text-center mb-14">
          <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
            Real Travellers
          </p>
          <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
            What Our Explorers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-light-200 rounded-[20px] p-7 shadow-300 flex flex-col gap-5"
            >
              <p className="font-plus-jakarta text-dark-400 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0ea5a4&color=fff`;
                  }}
                />
                <div>
                  <p className="font-plus-jakarta text-dark-100 text-sm font-semibold">{t.name}</p>
                  <p className="font-plus-jakarta text-gray-100 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    </Section>
  );
};

export default Testimonials;
