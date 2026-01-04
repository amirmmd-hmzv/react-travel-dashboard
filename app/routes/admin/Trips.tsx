import React from "react";
import { LuPlus } from "react-icons/lu";
import { Header } from "~/components";

const Trips = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Explore Your Trips
 `}
        description={
          "View, edit, and optimize AI-generated travel itineraries all in one place."
        }
        ctaUrl="/trips/create"
        ctaText=" Create New Trip"
        icon={<LuPlus className="size-6"/>}
      
      />
    </main>
  );
};

export default Trips;
