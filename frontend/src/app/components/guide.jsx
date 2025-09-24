import React from "react";
import Image from "next/image";
import guide1 from "../../../public/guide1.jpg";
import { PiHandTapLight } from "react-icons/pi";

export default function Guide() {
  return (
    <>
      <div className="w-full mt-24 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Guide the world with your passion
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Become a Guide
          </h1>
        </div>

        <div id="bg-image" className=" relative mt-12 ">
          <div className=" brightness-50">
            <Image
              src={guide1}
              alt="guide"
              width={2500}
              height={500}
              className="h-[14vh] sm:h-auto"
            />
          </div>
          <div className="absolute top-1/3 px-10 md:px-24 flex flex-col items-center justify-center gap-2 sm:gap-6 md:gap-8 lg:gap-12">
            <div>
              <p className="text-white text-[10px] sm:text-sm md:text-lg lg:text-2xl">
              &quot;We’re pioneers, storytellers, and explorers of the unbeaten
              path, dedicated to those who crave unique travel experiences. If
              you’re eager to join a community of innovative local tour guides
              who excel at crafting unforgettable journeys, we’d love to connect
              with you&quot;
            </p>
            </div>
            <div className=" flex items-center justify-center gap-1 px-[4px] py-[3px] sm:px-2 sm:py-1 lg:px-3 lg:py-2 border-2 border-red-500 w-fit hover:bg-red-500 hover:transition-all">
              <button className="text-white font-medium text-xs sm:text-sm md:text-md lg:text-lg ">
                Apply Now{" "}
              </button>
              <span className="">
                <PiHandTapLight size={24} className="text-white" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
