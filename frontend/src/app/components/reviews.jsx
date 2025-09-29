"use client";

import { IoIosStar } from "react-icons/io";
import Image from "next/image";
import pfp1 from "../../../public/pfp1.jpg";
import pfp3 from "../../../public/pfp3.jpg";
import pfp6 from "../../../public/pfp6.jpg";
import React, { useState, useEffect } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import required modules
import { Autoplay } from "swiper/modules";

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reviews/featured"
        );
        const data = await response.json();

        if (data.success) {
          setReviewsData(data.data);
        } else {
          console.log("No reviews available");
          // Fallback to sample data if no reviews
          setReviewsData(getSampleReviews());
        }
      } catch (error) {
        console.error("Failed to fetch reviews from MongoDB", error);
        // Fallback to sample data if API fails
        setReviewsData(getSampleReviews());
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  // Sample reviews fallback (you can remove this once you have real data)
  const getSampleReviews = () => [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 4.8,
      caption: "Amazing experience with Rajesh!",
      review:
        "Rajesh showed us hidden gems in Delhi that we would never have found on our own. His knowledge of local history was impressive!",
      date: "January 15, 2024",
    },
    {
      id: 2,
      name: "Arun Kumar",
      location: "Bangalore, India",
      rating: 5.0,
      caption: "Best food tour in Mumbai!",
      review:
        "Meera took us to the most incredible street food spots. We tasted authentic Mumbai flavors and learned so much about local cuisine.",
      date: "December 28, 2023",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 4.7,
      caption: "Cultural immersion at its best",
      review:
        "Vikram's spiritual tour of Varanasi was transformative. He explained the rituals with such depth and respect. Highly recommended!",
      date: "January 8, 2024",
    },
    {
      id: 4,
      name: "Mike Chen",
      location: "Singapore",
      rating: 4.9,
      caption: "Perfect Goa adventure",
      review:
        "Arun planned the perfect mix of beach relaxation and adventure activities. His local connections got us the best experiences!",
      date: "December 20, 2023",
    },
    {
      id: 5,
      name: "Anita Patel",
      location: "Ahmedabad, India",
      rating: 4.6,
      caption: "Royal treatment in Jaipur",
      review:
        "Meera's knowledge of Jaipur's royal history brought the palaces to life. She even helped us get great deals at local markets!",
      date: "January 5, 2024",
    },
  ];

  const getRandomAvatar = () => {
    const avatars = [pfp1, pfp3, pfp6];
    return avatars[Math.floor(Math.random() * avatars.length)];
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
        <div className="text-gray-600 mt-8">Loading reviews...</div>
      </div>
    );
  }

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

      <Swiper
        slidesPerView={1}
        spaceBetween={15}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        modules={[Autoplay]}
        className="mySwiper w-full px-10 lg:px-24  flex flex-col items-center justify-center text-center"
      >
        {reviewsData.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="flex flex-col items-start border gap-4 border-gray-300 rounded-xl p-6 bg-slate-50 h-full">
              <div className="flex items-start gap-[4px] text-md">
                <p>{review.rating.toFixed(1)}</p>
                <span className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <IoIosStar
                      key={i}
                      size={20}
                      className={
                        i < Math.round(review.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="font-semibold text-lg text-left">
                  {review.caption}
                </h3>
                <p className="text-left font-light text-[15px]">
                  &quot;{review.review}&quot;
                </p>
              </div>
              <div className="w-full flex items-center mt-4">
                <div className="flex">
                  <Image
                    src={getRandomAvatar()}
                    alt={review.name}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-red-500 p-[2px]"
                  />
                </div>
                <div className="flex flex-col items-start justify-center ml-4">
                  <p className="font-semibold text-base text-left">
                    {review.name}
                  </p>
                  <p className="font-light text-[13px] text-left">
                    {review.location}
                  </p>
                  <p className="font-light text-[13px] text-left">
                    {review.date}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
