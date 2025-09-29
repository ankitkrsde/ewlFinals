"use client";

import Image from "next/image";
import React from "react";
import aboutus from "../../../public/aboutus.jpg";
import team from "../../../public/team.jpg";
import Link from "next/link";

export default function AboutUs() {
  const handleJoinClick = () => {
    // Scroll to guide section if on homepage, otherwise redirect
    if (window.location.pathname === "/") {
      document
        .getElementById("become-guide-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#become-guide-section";
    }
  };

  return (
    <>
      <div className="w-full flex flex-col mb-24">
        {/* Hero Section */}
        <div className="h-[60vh] flex items-center justify-center bg-[url('/aboutus.jpg')] bg-no-repeat bg-center bg-cover relative">
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="flex flex-col gap-2 md:gap-4 items-center justify-center relative z-10">
            <div className="flex items-center gap-0 md:gap-4 font-poppins text-lg text-gray-700 font-medium">
              <span className="h-[2px] w-16 bg-purple-500"></span>
              <span className="text-white md:text-gray-800 bg-none md:bg-gray-50 px-4 text-sm sm:text-lg md:text-xl text-center">
                Discover the World with ExploreWithLocals
              </span>
              <span className="h-[2px] w-16 bg-purple-500"></span>
            </div>
            <div>
              <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-50 leading-tight text-center">
                About Us
              </h1>
            </div>
          </div>
        </div>

        {/* Team Image & Introduction */}
        <div className="flex flex-col items-center justify-center px-10 lg:px-48">
          <div>
            <Image
              src={team}
              alt="ExploreWithLocals team - Local guides and travel experts"
              width={700}
              height={1000}
              className="my-12 shadow-2xl rounded-sm"
            />
          </div>
          <p className="mt-4 text-lg text-gray-700 text-center ">
            At ExploreWithLocals, we believe that travel is not just about
            visiting new places — it&apos;s about experiencing the world in its
            most authentic and enriching form. Founded with a passion for
            exploration and a deep love for culture, our mission is to connect
            travelers with unforgettable experiences that go beyond the
            ordinary.
          </p>
        </div>

        {/* Who We Are */}
        <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48  mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
            Who We Are
          </h3>
          <p className="text-gray-700">
            We are a team of seasoned travelers, adventure enthusiasts, and
            local experts who have come together to share our love for the
            world. With years of experience in the tourism industry, we
            understand what makes a journey truly memorable. Our guides are not
            just experts in their fields—they are storytellers, history buffs,
            and cultural ambassadors who bring each destination to life.
          </p>
        </div>

        {/* What We Offer */}
        <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48  mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
            What We Offer
          </h3>
          <p className="text-gray-700">
            Whether you&apos;re a solo traveler, a couple on a romantic getaway,
            or a family looking for an exciting adventure, ExploreWithLocals has
            something for everyone. Our carefully curated tours are designed to
            offer a unique perspective on each destination, highlighting hidden
            gems, local traditions, and authentic experiences that you
            won&apos;t find in guidebooks.
          </p>
          <ul className="flex flex-col gap-4 mt-4">
            <li className="font-semibold text-lg text-gray-800">
              Personalized Tours :{" "}
              <span className="font-normal text-base text-gray-700">
                We tailor each experience to your interests, ensuring that every
                trip is as unique as you are.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Expert Guides :{" "}
              <span className="font-normal text-base text-gray-700">
                Our guides are locals who know the ins and outs of their cities,
                offering insider knowledge and personalized recommendations.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Cultural Immersion:{" "}
              <span className="font-normal text-base text-gray-700">
                We focus on experiences that allow you to connect with local
                communities, taste traditional cuisines, and participate in
                cultural practices.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Sustainable Travel:{" "}
              <span className="font-normal text-base text-gray-700">
                We are committed to responsible tourism that respects the
                environment and supports local economies.
              </span>
            </li>
          </ul>
        </div>

        {/* Our Values */}
        <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48  mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
            Our Values
          </h3>
          <p className="text-gray-700">
            At ExploreWithLocals, we are driven by our core values of
            authenticity, passion, and respect. We strive to provide meaningful
            travel experiences that not only satisfy your wanderlust but also
            leave a positive impact on the destinations we visit.
          </p>
          <ul className="flex flex-col gap-4 mt-4">
            <li className="font-semibold text-lg text-gray-800">
              Authenticity :{" "}
              <span className="font-normal text-base text-gray-700">
                We believe in offering genuine experiences that showcase the
                true essence of each place.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Passion :{" "}
              <span className="font-normal text-base text-gray-700">
                Our love for travel fuels everything we do, from planning
                itineraries to guiding tours.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Respect :{" "}
              <span className="font-normal text-base text-gray-700">
                We are dedicated to promoting responsible tourism that honors
                local cultures and environments.
              </span>
            </li>
          </ul>
        </div>

        {/* Why Choose Us */}
        <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48 ">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
            Why Choose Us?
          </h3>
          <ul className="flex flex-col gap-4 mt-4">
            <li className="font-semibold text-lg text-gray-800">
              Local Expertise :{" "}
              <span className="font-normal text-base text-gray-700">
                Our guides are natives who offer unparalleled knowledge and
                unique insights into their communities.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Flexible Options :{" "}
              <span className="font-normal text-base text-gray-700">
                We offer a range of tours, from day trips to extended journeys,
                with options to customize your experience.
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Commitment to Quality :{" "}
              <span className="font-normal text-base text-gray-700">
                We are dedicated to providing high-quality services, from the
                moment you book to the end of your journey.
              </span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48  mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">
            Join Us on Your Next Adventure
          </h3>
          <p className="text-gray-700">
            Whether you&apos;re exploring a bustling city, trekking through
            scenic landscapes, or discovering ancient ruins, ExploreWithLocals
            is here to make your journey one you&apos;ll never forget. Let us
            guide you through the wonders of the world, one unforgettable
            experience at a time.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/guides/search"
              className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-center"
            >
              Find Local Guides
            </Link>
            <button
              onClick={handleJoinClick}
              className="bg-transparent border-2 border-red-600 text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              Become a Guide
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 px-10 lg:px-48  mx-auto">
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-red-700">
              500+
            </div>
            <div className="text-gray-700 text-sm">Verified Guides</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-red-700">
              50+
            </div>
            <div className="text-gray-700 text-sm">Cities in India</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-red-700">
              10K+
            </div>
            <div className="text-gray-700 text-sm">Happy Travelers</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-2xl md:text-3xl font-bold text-red-700">
              98%
            </div>
            <div className="text-gray-700 text-sm">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </>
  );
}
