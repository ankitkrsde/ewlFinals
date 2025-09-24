import React from "react";
import Image from "next/image";
// import { CiHeart } from "react-icons/ci";
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
  return (
    <>
      <div className="w-full px-10 lg:px-36 mt-24 flex flex-col  justify-center text-center">
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
        </div>

        {/* Guide section  */}
        <div
          id="guide-section"
          className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5 items-center justify-center"
        >
          <div
            id="card"
            className="border border-gray-200  p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50"
          >
            <div id="top-part">
              <Image
                src={lg1}
                alt="lg1"
                width={300}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <div
              id="bottom-part"
              className="flex flex-col items-start gap-[6px] mt-8 "
            >
              <div className="w-full pb-2 flex items-center justify-between">
                <h3 className="text-2xl">Karan Singh</h3>
                <FaHeart
                  size={24}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-md">
                  4.5
                  <span className="flex gap-1">
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStarHalf size={20} className="text-yellow-500" />
                  </span>
                  <span className="text-md">(20)</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <CiLocationOn size={24} />
                </span>
                <p className="text-md">Punjab, India</p>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  <CiGlobe size={22} />
                </span>
                <p className="text-md">English, Hindi, Punjabi </p>
              </div>
            </div>
          </div>

          <div
            id="card"
            className="border border-gray-200 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50"
          >
            <div id="top-part">
              <Image
                src={lg2}
                alt="lg2"
                width={300}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <div
              id="bottom-part"
              className="flex flex-col items-start gap-[6px] mt-8 "
            >
              <div className="w-full pb-2 flex items-center justify-between">
                <h3 className="text-2xl">Karan Singh</h3>
                <FaHeart
                  size={24}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-md">
                  4.5
                  <span className="flex gap-1">
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStarHalf size={20} className="text-yellow-500" />
                  </span>
                  <span className="text-md">(20)</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <CiLocationOn size={24} />
                </span>
                <p className="text-md">Punjab, India</p>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  <CiGlobe size={22} />
                </span>
                <p className="text-md">English, Hindi, Punjabi </p>
              </div>
            </div>
          </div>

          <div
            id="card"
            className="border border-gray-200 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50"
          >
            <div id="top-part">
              <Image
                src={lg3}
                alt="lg3"
                width={300}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <div
              id="bottom-part"
              className="flex flex-col items-start gap-[6px] mt-8 "
            >
              <div className="w-full pb-2 flex items-center justify-between">
                <h3 className="text-2xl">Karan Singh</h3>
                <FaHeart
                  size={24}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-md">
                  4.5
                  <span className="flex gap-1">
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStarHalf size={20} className="text-yellow-500" />
                  </span>
                  <span className="text-md">(20)</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <CiLocationOn size={24} />
                </span>
                <p className="text-md">Punjab, India</p>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  <CiGlobe size={22} />
                </span>
                <p className="text-md">English, Hindi, Punjabi </p>
              </div>
            </div>
          </div>

          <div
            id="card"
            className="border border-gray-200 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50"
          >
            <div id="top-part">
              <Image
                src={lg4}
                alt="lg4"
                width={300}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <div
              id="bottom-part"
              className="flex flex-col items-start gap-[6px] mt-8 "
            >
              <div className="w-full pb-2 flex items-center justify-between">
                <h3 className="text-2xl">Karan Singh</h3>
                <FaHeart
                  size={24}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-md">
                  4.5
                  <span className="flex gap-1">
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStarHalf size={20} className="text-yellow-500" />
                  </span>
                  <span className="text-md">(20)</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <CiLocationOn size={24} />
                </span>
                <p className="text-md">Punjab, India</p>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  <CiGlobe size={22} />
                </span>
                <p className="text-md">English, Hindi, Punjabi </p>
              </div>
            </div>
          </div>

          <div
            id="card"
            className="border border-gray-200  p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1 bg-slate-50"
          >
            <div id="top-part">
              <Image
                src={lg1}
                alt="lg1"
                width={300}
                height={500}
                className="object-cover rounded-xl"
              />
            </div>
            <div
              id="bottom-part"
              className="flex flex-col items-start gap-[6px] mt-8 "
            >
              <div className="w-full pb-2 flex items-center justify-between">
                <h3 className="text-2xl">Karan Singh</h3>
                <FaHeart
                  size={24}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-md">
                  4.5
                  <span className="flex gap-1">
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStar size={20} className="text-yellow-500" />
                    <IoIosStarHalf size={20} className="text-yellow-500" />
                  </span>
                  <span className="text-md">(20)</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <CiLocationOn size={24} />
                </span>
                <p className="text-md">Punjab, India</p>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  <CiGlobe size={22} />
                </span>
                <p className="text-md">English, Hindi, Punjabi </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
