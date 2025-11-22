"use client";
import React from "react";
import Hero from "../components/hero";
import CityCards from "../components/cityCards";
import LocalsSection from "../components/localsSection";
import WhyChooseUs from "../components/whyChooseUs";

import Guide from "../components/guide";
import { useAuth } from "../components/AuthProvider";
import Reviews from "../components/reviews/reviews";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Hero user={user} />
      <CityCards />
      <LocalsSection />
      <WhyChooseUs />
      <Reviews />
      {/* <Guide user={user} /> */}
    </div>
  );
}

