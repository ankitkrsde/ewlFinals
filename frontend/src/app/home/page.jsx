import React from "react";
import Hero from "../components/hero";
import CityCards from "../components/cityCards";
import LocalsSection from "../components/localsSection";
import WhyChooseUs from "../components/whyChooseUs";
import Reviews from "../components/reviews";
import Guide from "../components/guide";

export default function Page() {
  return (
    <div>
      <Hero />
      <CityCards />
      <LocalsSection />
      <WhyChooseUs />
      <Reviews />
      <Guide />
    </div>
  );
}
