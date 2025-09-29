import React from "react";
import Link from "next/link";
import pc1 from "../../../public/cities/delhi.jpg";
import pc2 from "../../../public/cities/mumbai.jpg";
import pc3 from "../../../public/cities/goa.jpg";
import pc4 from "../../../public/cities/jaipur.jpg";
import pc5 from "../../../public/cities/varanasi.jpg";
import pc6 from "../../../public/cities/kerala.jpg";
import pc7 from "../../../public/cities/agra.jpg";
import pc8 from "../../../public/cities/rishikesh.jpg";

import Image from "next/image";

export default function CityCards() {
  // Indian cities data that matches your platform's focus
  const indianCities = [
    {
      name: "Delhi",
      image: pc1,
      guides: 45,
      description: "Capital city with rich history",
    },
    {
      name: "Mumbai",
      image: pc2,
      guides: 38,
      description: "City of dreams and beaches",
    },
    {
      name: "Goa",
      image: pc3,
      guides: 52,
      description: "Beach paradise and Portuguese heritage",
    },
    {
      name: "Jaipur",
      image: pc4,
      guides: 28,
      description: "Pink city with royal palaces",
    },
    {
      name: "Varanasi",
      image: pc5,
      guides: 22,
      description: "Spiritual capital on Ganges",
    },
    {
      name: "Kerala",
      image: pc6,
      guides: 35,
      description: "Backwaters and lush greenery",
    },
    {
      name: "Agra",
      image: pc7,
      guides: 19,
      description: "Home of the Taj Mahal",
    },
    {
      name: "Rishikesh",
      image: pc8,
      guides: 15,
      description: "Yoga capital and adventure hub",
    },
  ];

  return (
    <>
      <div className="w-full px-10 lg:px-36 mt-24 md:mt-48 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10 mt-6 md:mt-0 ">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Top Destinations to Explore Across India
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Popular Cities
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Discover authentic local experiences with verified guides in India's
            most fascinating destinations
          </p>
        </div>

        <div
          id="grid-container"
          className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid lg:grid-cols-4 auto-rows-[250px] lg:gap-3"
        >
          {indianCities.map((city, index) => (
            <Link
              key={city.name}
              href={`/guides/search?city=${encodeURIComponent(city.name)}`}
              className={`p-[1px] relative flex justify-center group hover:scale-105 transition-all duration-500 cursor-pointer ${
                index === 0
                  ? "col-span-2"
                  : index === 2
                    ? "row-span-2"
                    : index === 4
                      ? "col-span-2"
                      : index === 5
                        ? "row-span-2 lg:col-span-2 lg:row-span-1"
                        : ""
              }`}
            >
              {/* City name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <h3 className="text-2xl lg:text-xl font-bold text-white mb-1">
                  {city.name}
                </h3>
                <p className="text-white/90 text-sm hidden group-hover:block">
                  {city.guides}+ Local Guides
                </p>
              </div>

              {/* Hover info card */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="bg-white/95 p-4 rounded-lg mx-4 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-gray-800 text-sm font-medium text-center">
                    {city.description}
                  </p>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-full text-xs mt-2 hover:bg-red-600 transition-colors">
                    Explore Guides
                  </button>
                </div>
              </div>

              <Image
                className="object-cover rounded-lg w-full h-full"
                src={city.image}
                alt={`Local guides in ${city.name}`}
                width={1000}
                height={600}
              />
            </Link>
          ))}
        </div>

        {/* View all cities link */}
        <Link
          href="/guides/search"
          className="mt-12 bg-red-500 text-white font-poppins font-semibold px-8 py-3 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
        >
          View All Cities & Guides
        </Link>
      </div>
    </>
  );
}
