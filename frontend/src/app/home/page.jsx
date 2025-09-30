"use client";
import React from "react";
import Hero from "../components/hero";
import CityCards from "../components/cityCards";
import LocalsSection from "../components/localsSection";
import WhyChooseUs from "../components/whyChooseUs";
import Reviews from "../components/reviews";
import Guide from "../components/guide";
import { useAuth } from "../components/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Hero user={user} />
      <CityCards />
      <LocalsSection />
      <WhyChooseUs />
      <Reviews />
      <Guide user={user} />
    </div>
  );
}

// stop i will give you the other components code so you can enhance them, please dont go forward too fast, until i provide the particular page of code to enhance
