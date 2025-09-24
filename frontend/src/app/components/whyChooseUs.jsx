import Image from "next/image";
import React from "react";
import discount from "../../../public/discount.png";
import twenty1 from "../../../public/twenty1.png";
import expert from "../../../public/expert.png";

export default function WhyChooseUs() {
  return (
    <>
      <div className="w-full mt-24 flex flex-col items-center justify-center text-center">
        {/* <div className="flex flex-col items-center justify-center mb-16 ">
          <div className="flex items-center gap-0 md:gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-base md:text-xl">
              Experience the best with{" "}
              <span className="text-red-600">ExploreWithLocals</span>
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
        </div> */}

        <div className="w-full p-6 bg-gradient-to-r from-violet-600 to-indigo-600">
          <h3 className="font-poppins text-2xl mt-8 text-white leading-tight">
            Why
            <span className="text-yellow-400 font-semibold text-4xl px-2">
              ExploreWithLocals
            </span>
            is the perfect choice for your journey
          </h3>
          <div className="flex flex-col gap-12 md:flex-row md:gap-0 items-center justify-around mt-14 mb-4">
            <div className="w-80 md:w-72 flex flex-col justify-center items-center">
              <div>
                <Image src={discount} alt="discount" width={80} height={100} />
              </div>
              <h2 className="text-yellow-400 text-xl pt-3 font-semibold">
                Deals & Discounts
              </h2>
              <p className="text-white text-sm pt-2">
                Get exclusive deals and discounts on our site for premium
                experiences at competitive prices
              </p>
            </div>
            <div className="w-80 md:w-72 flex flex-col justify-center items-center">
              <div>
                <Image src={twenty1} alt="twenty1" width={70} height={100} />
              </div>
              <h2 className="text-yellow-400 text-xl pt-3 font-semibold">
                24/7 Customer Support
              </h2>
              <p className="text-white text-sm pt-2">
                Our site offers 24/7 customer support for any questions before,
                during, or after your trip
              </p>
            </div>
            <div className="w-80 md:w-72 flex flex-col justify-center items-center">
              <div>
                <Image src={expert} alt="expert" width={70} height={100} />
              </div>
              <h2 className="text-yellow-400 text-xl pt-3 font-semibold">
                Expert Local Knowledge
              </h2>
              <p className="text-white text-sm pt-2">
                The website connects travelers with local guides for authentic
                and insightful destination information
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
