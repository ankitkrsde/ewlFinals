"use client";

import { IoIosStar } from "react-icons/io";
import Image from "next/image";
import pfp1 from "../../../public/pfp1.jpg";
// import pfp2 from "../../../public/pfp2.jpg";
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

// Firebase
import { database } from "../components/firebase";
import { ref, get, child } from "firebase/database";

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dbRef = ref(database);
      try {
        const snapshot = await get(child(dbRef, "/reviews"));
        if (snapshot.exists()) {
          setReviewsData(snapshot.val());
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, []); // Empty array ensures useEffect runs only once on mount

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
        className="mySwiper w-full px-10 lg:px-24 mt-12 flex flex-col items-center justify-center text-center"
      >
        {reviewsData &&
          reviewsData.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-start border gap-4 border-gray-300 rounded-xl p-6 bg-slate-50">
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
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-lg text-left">
                    {review.caption}
                  </h3>
                  <p className="text-left font-light text-[15px]">
                    &quot;{review.review}&quot;
                  </p>
                </div>
                <div className="w-full flex items-center">
                  <div className="flex">
                    <Image
                      src={pfp1}
                      alt="pfp1"
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-red-500 p-[2px]"
                    />
                    <Image
                      src={pfp6}
                      alt="pfp6"
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-purple-500 p-[2px] -translate-x-7"
                    />
                    <Image
                      src={pfp3}
                      alt="pfp2"
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-red-500 p-[2px] -translate-x-14"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
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
