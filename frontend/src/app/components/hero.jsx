import Image from "next/image";
import Link from "next/link";

// Images
import bg1 from "../../../public/bg1.jpg";
import bg2 from "../../../public/bg2.jpg";
import bg3 from "../../../public/bg3.jpg";
import bg4 from "../../../public/bg4.jpg";
import d1 from "../../../public/d1.jpg";
import d2 from "../../../public/d2.jpg";
import d3 from "../../../public/d3.jpg";
import d4 from "../../../public/d4.jpg";
import d5 from "../../../public/d5.jpg";
import d6 from "../../../public/d6.jpg";
import d7 from "../../../public/d7.jpg";

import { IoIosSearch } from "react-icons/io";

export default function Hero() {
  return (
    <>
      <main className="flex lg:flex-row flex-col items-center justify-center px-10 lg:px-36 relative ">
        <div id="bg-img" className="absolute w-screen -z-10 -translate-y-10 ">
          <Image
            src={bg4}
            className="h-screen object-fill bg-cover brightness-75 contrast-125"
            alt="bg-img"
            width={1920}
            height={1235}
          />
        </div>
        <div
          id="left-part"
          className="w-full lg:w-1/2 pt-8 mt-8 flex flex-col justify-center items-center md:items-start "
        >
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-[2.6rem] md:text-[2.9rem] font-bold leading-snug font-poppins text-white">
              Unforgettable experiences, with{" "}
              <span className="text-yellow-400">wonderful locals</span>
            </h1>
            <p className="font-medium text-xl  py-4 leading-snug font-poppins text-white ">
              Discover distinctive and unforgettable travel adventures with
              local guides
            </p>
          </div>

          <div className="relative my-24">
            <div className="absolute top-[5px] right-[22px] h-full cursor-pointer">
              <Link href="./../guides/search">
                <button className="flex items-center gap-2 md:px-5 px-3 md:py-[11px] py-3 bg-red-600 rounded-full text-white hover:bg-red-700 hover:transition hover:duration-500 hover:ease-in-out ">
                  <span className="hidden md:flex">Search</span>
                  <IoIosSearch size={22} />
                </button>
              </Link>
            </div>
            <input
              className="w-[20rem] sm:w-[25rem] md:w-[32rem] h-14 px-6 py-3 mx-4 text-lg rounded-full focus:outline-none shadow-lg"
              type="text"
              placeholder="Where are you going?"
            />
          </div>
        </div>

        {/* Image grid  */}

        <div id="right-part" className="w-full lg:w-1/2 mt-8 hidden xl:block">
          <div class="flex items-center justify-end gap-x-4 ">
            <div class="grid grid-cols-1 place-items-end gap-y-3 lg:gap-y-4">
              <div class="h-32 w-56 shadow-lg overflow-hidden rounded-lg lg:opacity-100 hover:scale-105 transition-all duration-500">
                <Image
                  src={d1}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full object-cover object-center"
                />
              </div>
              <div class="h-52 w-36 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d2}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full object-cover
                      object-center"
                />
              </div>
            </div>
            <div class="grid flex-shrink-0 grid-cols-1 gap-y-3 lg:gap-y-4">
              <div class="h-52 w-36 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d3}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full
                      object-cover object-center"
                />
              </div>
              <div class="h-36 w-36 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d4}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full
                      object-cover object-center"
                />
              </div>
              <div class="h-52 w-36 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d5}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full
                      object-cover object-center"
                />
              </div>
            </div>
            <div class="grid flex-shrink-0 grid-cols-1 gap-y-3 lg:gap-y-4">
              <div class="h-52 w-36 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d6}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full
                      object-cover object-center"
                />
              </div>
              <div class="h-32 w-56 shadow-lg overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={d7}
                  alt="alt"
                  width={1000}
                  height={1000}
                  class="h-full w-full object-cover
                      object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
