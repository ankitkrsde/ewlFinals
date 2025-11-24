"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LocalsSection() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Fetch real guides from your backend
  useEffect(() => {
    fetchRealGuides();
  }, []);

  const fetchRealGuides = async () => {
    try {
      console.log("🌐 Fetching ALL guides including pending ones...");

      // Remove filters to see ALL guides
      const response = await fetch(
        `${API_BASE_URL}/api/guides?includePending=true`
      );
      const data = await response.json();

      console.log("📦 ALL guides response:", data);
      console.log("👥 Guides found:", data.data?.length);

      if (data.success) {
        setGuides(data.data || []);
        console.log(`🎯 Loaded ${data.data.length} guides total`);

        // Log each guide's rating info
        data.data.forEach((guide, index) => {
          console.log(`📋 Guide ${index + 1}: ${guide.userId?.name}`, {
            guideId: guide._id,
            userId: guide.userId?._id,
            rating: guide.rating,
            hasRating: !!guide.rating,
            average: guide.rating?.average,
            count: guide.rating?.count,
          });
        });
      }
    } catch (error) {
      console.error("💥 Fetch Error:", error);
      setError("Failed to load guides");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate beautiful gradient based on guide name
  const generateGradient = (name) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-blue-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-teal-500 to-green-600",
      "from-indigo-500 to-purple-600",
      "from-pink-500 to-rose-600",
      "from-cyan-500 to-blue-600",
    ];

    // Simple hash function to get consistent color for each guide
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const renderStars = (rating) => {
    // Debug rating value
    console.log("⭐ Rendering stars for rating:", rating);

    if (!rating || rating === 0) {
      return <span className="text-sm text-gray-500">No ratings yet</span>;
    }

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

    // Fill remaining stars with outline
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IoIosStar key={`empty-${i}`} size={20} className="text-gray-300" />
      );
    }

    return stars;
  };

  const handleFavorite = (guideId, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Added guide ${guideId} to favorites`);
    // TODO: Implement favorite functionality with your backend
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Sort guides by rating (highest first) and then by number of reviews
  const sortedGuides = [...guides].sort((a, b) => {
    const ratingA = a.rating?.average || 0;
    const ratingB = b.rating?.average || 0;
    const reviewsA = a.rating?.count || 0;
    const reviewsB = b.rating?.count || 0;

    // Sort by rating first, then by number of reviews
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }
    return reviewsB - reviewsA;
  });

  // Get guides to display - 5 for homepage, all when showAll is true
  const displayedGuides = showAll ? sortedGuides : sortedGuides.slice(0, 5);

  if (loading) {
    return (
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10">
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
            Loading our most experienced and highly-rated local guides...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Top Local Guides
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Failed to load guides. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10">
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

          {/* Show count info */}
          {guides.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Showing {displayedGuides.length} of {guides.length} guides
              {!showAll &&
                guides.length > 5 &&
                " - Click 'Show All Guides' to see more"}
            </div>
          )}
        </div>

        {/* Real Guides Section */}
        {guides.length > 0 ? (
          <div className="flex flex-col gap-6">
            {/* Guides Grid */}
            <div
              className={`flex flex-col gap-6 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5 items-center justify-center ${!showAll ? "max-h-[800px] overflow-hidden" : ""}`}
            >
              {displayedGuides.map((guide) => {
                const guideName = guide.userId?.name || "Local Guide";
                const gradient = generateGradient(guideName);
                const initials = guideName
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                // Debug individual guide rating
                console.log(`🎯 Rendering guide: ${guideName}`, {
                  rating: guide.rating,
                  average: guide.rating?.average,
                  count: guide.rating?.count,
                });

                return (
                  <Link
                    key={guide._id}
                    href={`/guides/${guide.userId?._id}`}
                    className="block border border-gray-200 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2 bg-white cursor-pointer group"
                  >
                    <div className="relative">
                      {/* Beautiful Gradient Avatar with Initials */}
                      <div
                        className={`w-full h-48 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                      >
                        <div className="text-white text-6xl font-bold drop-shadow-lg">
                          {initials}
                        </div>

                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      </div>

                      {/* Hourly Rate Badge */}
                      <div className="absolute top-3 right-3 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ₹{guide.hourlyRate}/hr
                      </div>

                      {/* Verification Badge */}
                      {guide.verificationStatus === "approved" && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span>✓</span>
                          <span>Verified</span>
                        </div>
                      )}

                      {/* Rating Badge - FIXED: Check if rating exists and average > 0 */}
                      {guide.rating && guide.rating.average > 0 && (
                        <div className="absolute bottom-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span>⭐</span>
                          <span>{guide.rating.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 mt-4">
                      {/* Name and Favorite */}
                      <div className="w-full flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-red-500 transition-colors">
                          {guideName}
                        </h3>
                        <FaHeart
                          size={18}
                          className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                          onClick={(e) => handleFavorite(guide._id, e)}
                        />
                      </div>

                      {/* Rating - FIXED: Proper conditional rendering */}
                      <div className="flex items-center gap-2">
                        {guide.rating && guide.rating.average > 0 ? (
                          <>
                            <div className="flex items-center gap-1">
                              {renderStars(guide.rating.average)}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {guide.rating.average.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({guide.rating.count || 0} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No ratings yet
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 w-full">
                        <CiLocationOn
                          size={18}
                          className="text-gray-600 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-700 line-clamp-1 text-left">
                          {guide.cities?.join(", ") || "Multiple cities"}
                        </p>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center gap-2 w-full">
                        <CiGlobe
                          size={16}
                          className="text-gray-600 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-700 line-clamp-1 text-left">
                          {guide.languages?.slice(0, 2).join(", ") ||
                            "Multiple languages"}
                          {guide.languages?.length > 2 && "..."}
                        </p>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guide.specialties
                          ?.slice(0, 2)
                          .map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium border border-red-100"
                            >
                              {specialty}
                            </span>
                          ))}
                        {guide.specialties?.length > 2 && (
                          <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-100">
                            +{guide.specialties.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Experience Badge */}
                      {guide.experience > 0 && (
                        <div className="w-full mt-2">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                            ⭐ {guide.experience}+ years experience
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Show More/Less Button */}
            {guides.length > 5 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={toggleShowAll}
                  className="bg-red-500 text-white font-poppins font-semibold px-8 py-4 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg hover:shadow-xl inline-block transform hover:-translate-y-1 transition-transform"
                >
                  {showAll
                    ? `Show Less (Top 5)`
                    : `Show All ${guides.length} Guides`}
                </button>
              </div>
            )}

            {/* View All Guides Link (Goes to search page) */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Looking for a specific guide or location?
              </p>
              <Link
                href="/guides/search"
                className="bg-red-500 text-white font-poppins font-semibold px-8 py-4 rounded-full hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl inline-block transform hover:-translate-y-1 transition-transform"
              >
                Browse All Guides with Filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-500">👋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Guides Available Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to join as a local guide and help travelers
                discover amazing experiences!
              </p>
              <Link
                href="/auth/register"
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Become a Guide →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
