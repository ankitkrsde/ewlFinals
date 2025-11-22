"use client";

import { IoIosStar } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRealReviews, setHasRealReviews] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        console.log("🔄 Fetching reviews from API...");
        setDebugInfo("Fetching reviews...");

        const response = await fetch(
          "http://localhost:5000/api/reviews/featured"
        );

        console.log("📊 API Response status:", response.status);
        const data = await response.json();

        console.log("📦 Full API Response:", data);
        setDebugInfo(
          `API Response: ${data.success ? "Success" : "Failed"}, Count: ${data.count}`
        );

        if (data.success && data.data && data.data.length > 0) {
          console.log("✅ Found real reviews:", data.data.length);

          // Transform the backend data to match frontend structure
          const transformedReviews = data.data.map((review, index) => {
            // Handle location object - convert to string
            let location = "India";
            if (review.touristId?.location) {
              if (typeof review.touristId.location === "object") {
                // If location is an object, extract city or use the first available value
                location =
                  review.touristId.location.city ||
                  review.touristId.location.state ||
                  review.touristId.location.country ||
                  "India";
              } else if (typeof review.touristId.location === "string") {
                // If location is already a string, use it directly
                location = review.touristId.location;
              }
            }

            // Get guide name
            const guideName = review.guideId?.name || "Local Guide";

            return {
              id: review._id || `review-${index}`,
              name: review.touristId?.name || "Traveler",
              location: location,
              rating: review.rating?.overall || review.rating || 5,
              caption: `Tour with ${guideName}`,
              review:
                review.comment || "Great experience with the local guide!",
              date: review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Recently",
              guideName: guideName,
            };
          });

          setReviewsData(transformedReviews);
          setHasRealReviews(true);
          setDebugInfo(`Loaded ${transformedReviews.length} real reviews`);
        } else {
          console.log("❌ No real reviews available from API");
          setReviewsData([]);
          setHasRealReviews(false);
          setDebugInfo("No reviews found in API response");
        }
      } catch (error) {
        console.error("❌ Failed to fetch reviews from MongoDB", error);
        setReviewsData([]);
        setHasRealReviews(false);
        setDebugInfo(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  // Function to get avatar with initials (no image loading issues)
  const getAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Generate a consistent color based on the name
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-orange-500 to-orange-600",
      "from-teal-500 to-teal-600",
    ];

    const colorIndex = name.length % colors.length;
    const gradient = colors[colorIndex];

    return (
      <div
        className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full border-2 border-red-500 p-[2px] flex items-center justify-center text-white font-bold text-lg`}
      >
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Hear What Our Adventurers Have to Say
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Traveler Voices
          </h1>
        </div>
        <div className="text-gray-600 mt-8">
          Loading real traveler reviews...
        </div>
        <div className="text-sm text-gray-500 mt-4">{debugInfo}</div>
      </div>
    );
  }

  return (
    <div className="w-full px-10 lg:px-36 mt-24 flex flex-col items-center justify-center text-center mb-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
          <span className="h-[2px] w-16 bg-purple-500"></span>
          <span className="text-lg md:text-xl">
            Hear What Our Adventurers Have to Say
          </span>
          <span className="h-[2px] w-16 bg-purple-500"></span>
        </div>
        <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
          Traveler Voices
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl">
          Real experiences from travelers who explored India with our local
          guides
        </p>
      </div>

      {/* Empty State - No Reviews Yet */}
      {!hasRealReviews && reviewsData.length === 0 && (
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center border border-blue-200">
          <div className="text-6xl mb-6">🌟</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Be the First to Share Your Experience!
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            No reviews yet! Complete a tour with one of our amazing local guides
            and be the first to share your adventure story. Your review will
            help other travelers discover authentic experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <span className="text-blue-600 font-semibold">🎯 Step 1:</span>
              <p className="text-sm text-gray-600">Book a guide</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <span className="text-blue-600 font-semibold">🎯 Step 2:</span>
              <p className="text-sm text-gray-600">Complete your tour</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <span className="text-blue-600 font-semibold">🎯 Step 3:</span>
              <p className="text-sm text-gray-600">Share your experience</p>
            </div>
          </div>
        </div>
      )}

      {/* Real Reviews Slider */}
      {hasRealReviews && reviewsData.length > 0 && (
        <>
          <Swiper
            slidesPerView={1}
            spaceBetween={15}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 2, spaceBetween: 15 },
              1440: { slidesPerView: 3, spaceBetween: 20 },
            }}
            modules={[Autoplay]}
            className="mySwiper w-full px-10 lg:px-24 flex flex-col items-center justify-center text-center"
          >
            {reviewsData.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="flex flex-col items-start border gap-4 border-gray-300 rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  {/* Rating and Guide Info */}
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2 text-md">
                      <p className="font-semibold text-gray-800">
                        {review.rating.toFixed(1)}
                      </p>
                      <span className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <IoIosStar
                            key={i}
                            size={20}
                            className={
                              i < Math.floor(review.rating)
                                ? "text-yellow-500"
                                : i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                            }
                          />
                        ))}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tour with</p>
                      <p className="font-semibold text-blue-600">
                        {review.guideName}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col gap-2 flex-grow w-full">
                    <h3 className="font-semibold text-lg text-left text-gray-800">
                      {review.caption}
                    </h3>
                    <p className="text-left text-gray-600 leading-relaxed line-clamp-4">
                      &quot;{review.review}&quot;
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="w-full flex items-center mt-4 pt-4 border-t border-gray-200">
                    {getAvatar(review.name)}
                    <div className="flex flex-col items-start justify-center ml-4">
                      <p className="font-semibold text-base text-left text-gray-800">
                        {review.name}
                      </p>
                      <p className="text-sm text-gray-600 text-left">
                        📍 {review.location}
                      </p>
                      <p className="text-xs text-gray-500 text-left">
                        {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Real Reviews Counter */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm bg-green-50 border border-green-200 rounded-full px-4 py-2 inline-block">
              ✅ Showing {reviewsData.length} real traveler review
              {reviewsData.length !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          {!hasRealReviews
            ? "Your adventure story could be featured here! Book a guide and share your experience."
            : "Want to share your own experience? Book a guide and leave a review after your tour!"}
        </p>
      </div>
    </div>
  );
}
