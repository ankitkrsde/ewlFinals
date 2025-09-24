import React from "react";
import pc1 from "../../../public/pc1.jpg";
import pc2 from "../../../public/pc2.jpg";
import pc3 from "../../../public/pc3.jpg";
import pc4 from "../../../public/pc4.jpg";
import pc5 from "../../../public/pc5.jpg";
import pc6 from "../../../public/pc6.jpg";
import pc7 from "../../../public/pc7.jpg";
import pc8 from "../../../public/pc8.jpg";
import pc9 from "../../../public/pc9.jpg";

import Image from "next/image";

export default function CityCards() {
  return (
    <>
      <div className="w-full px-10 lg:px-36 mt-24 md: mt-48 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-10 mt-6 md:mt-0 ">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Top Destinations to Explore This Summer
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Popular Cities
          </h1>
        </div>
        <div
          id="grid-container"
          className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid lg:grid-cols-4 auto-rows-[250px] lg:gap-3"
        >
          <div className="p-[1px] relative flex justify-center group col-span-2 hover:scale-105 lg:hover:scale-100 transition-all duration-500">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-300">
              Paris
            </h3>
            <Image
              className=" object-cover rounded-lg"
              src={pc1}
              alt="pc1"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group hover:scale-105 transition-all duration-500">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Rome
            </h3>
            <Image
              className="object-cover rounded-lg "
              src={pc2}
              alt="pc2"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group row-span-2 ">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              London
            </h3>
            <Image
              className=" object-cover rounded-lg "
              src={pc3}
              alt="pc3"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group hover:scale-105 transition-all duration-500">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Bali
            </h3>
            <Image
              className="object-cover rounded-lg "
              src={pc5}
              alt="pc5"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group col-span-2">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Singapore
            </h3>
            <Image
              className="object-cover rounded-lg"
              src={pc8}
              alt="pc8"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group row-span-2 lg:col-span-2 lg:row-span-1 ">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Iceland
            </h3>
            <Image
              className="object-cover rounded-lg "
              src={pc6}
              alt="pc6"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group hover:scale-105 transition-all duration-500">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Nepal
            </h3>
            <Image
              className="object-cover rounded-lg "
              src={pc7}
              alt="pc7"
              width={1000}
              height={600}
            />
          </div>

          <div className="p-[1px] relative flex justify-center group hover:scale-105 transition-all duration-500">
            <h3 className="absolute bottom-0 text-4xl lg:text-3xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Switzerland
            </h3>
            <Image
              className="object-cover rounded-lg "
              src={pc4}
              alt="pc4"
              width={1000}
              height={600}
            />
          </div>

          {/* <div className="p-[1px] relative flex justify-center group">
            <h3 className="absolute bottom-0 text-4xl pb-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              Tokyo
            </h3>
            <Image
              className="object-cover rounded-lg"
              src={pc9}
              alt="pc8"
              width={600}
              height={600}
            />
          </div> */}
        </div>
      </div>
    </>
  );
}
