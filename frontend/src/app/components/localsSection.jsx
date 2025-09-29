"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";
import lg1 from "../../../public/lg1.jpg";
import lg2 from "../../../public/lg2.jpg";
import lg3 from "../../../public/lg3.jpg";
import lg4 from "../../../public/lg4.jpg";

export default function LocalsSection() {
  // Sample guide data - in real app, this would come from your backend
  const topGuides = [
    {
      id: 1,
      name: "Rajesh Kumar",
      city: "Delhi, India",
      languages: ["Hindi", "English"],
      rating: 4.8,
      reviews: 47,
      specialties: ["Historical", "Cultural"],
      image: lg1,
      hourlyRate: 500,
    },
    {
      id: 2,
      name: "Priya Sharma",
      city: "Mumbai, India",
      languages: ["Hindi", "English", "Marathi"],
      rating: 4.9,
      reviews: 52,
      specialties: ["Food", "Shopping"],
      image: lg2,
      hourlyRate: 600,
    },
    {
      id: 3,
      name: "Arun Patel",
      city: "Goa, India",
      languages: ["Hindi", "English", "Konkani"],
      rating: 4.7,
      reviews: 38,
      specialties: ["Beaches", "Adventure"],
      image: lg3,
      hourlyRate: 550,
    },
    {
      id: 4,
      name: "Meera Singh",
      city: "Jaipur, India",
      languages: ["Hindi", "English"],
      rating: 4.6,
      reviews: 29,
      specialties: ["Historical", "Architecture"],
      image: lg4,
      hourlyRate: 450,
    },
    {
      id: 5,
      name: "Vikram Joshi",
      city: "Varanasi, India",
      languages: ["Hindi", "English"],
      rating: 4.9,
      reviews: 41,
      specialties: ["Spiritual", "Cultural"],
      image: lg1,
      hourlyRate: 400,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoIosStar key={i} size={20} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(
        <IoIosStarHalf key="half" size={20} className="text-yellow-500" />
      );
    }

    return stars;
  };

  const handleFavorite = (guideId, e) => {
    e.preventDefault();
    e.stopPropagation();
    // In real app, this would call your API to add to favorites
    console.log(`Added guide ${guideId} to favorites`);
    // You could add a toast notification here
  };

  return (
    <>
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10 ">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Get to Know Your Local Guides
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Top Local Guides
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Meet our most experienced and highly-rated local guides across India
          </p>
        </div>

        {/* Guide section */}
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5 items-center justify-center">
          {topGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="block border border-gray-200 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50 cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={guide.image}
                  alt={`Local guide ${guide.name}`}
                  width={300}
                  height={800}
                  className="object-cover rounded-xl w-full h-70"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  ₹{guide.hourlyRate}/hr
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 mt-4">
                <div className="w-full pb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {guide.name}
                  </h3>
                  <FaHeart
                    size={20}
                    className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                    onClick={(e) => handleFavorite(guide.id, e)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <p className="flex items-center gap-2 text-sm">
                    {guide.rating}
                    <span className="flex gap-1">
                      {renderStars(guide.rating)}
                    </span>
                    <span className="text-gray-600">({guide.reviews})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <CiLocationOn size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-700">{guide.city}</p>
                </div>

                <div className="flex items-center gap-2">
                  <CiGlobe size={16} className="text-gray-600" />
                  <p className="text-sm text-gray-700">
                    {guide.languages.join(", ")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {guide.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all guides link */}
        <div className="mt-12">
          <Link
            href="/guides/search"
            className="bg-red-500 text-white font-poppins font-semibold px-8 py-3 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg inline-block"
          >
            View All Guides
          </Link>
        </div>
      </div>
    </>
  );
}
