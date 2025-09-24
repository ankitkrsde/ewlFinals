"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/logo.png";

/*React icons*/
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    // console.log("menu is triggred!!!");
    setIsOpen(!isOpen);
  }
  return (
    <>
      <header className="">
        <nav className=" px-10 lg:px-36 py-1 flex justify-between  items-center  bg-white shadow-md z-30">
          <div className="flex items-center">
            <div className="my-4">
              <Link href="/">
                <Image
                  className="object-cover max-w-40 max-h-40"
                  src={logoImg}
                  alt="website logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          </div>

          <div className="gap-x-6 lg:gap-x-12 hidden md:flex">
            <Link
              href="/"
              className="font-poppins font-semibold text-gray-800 hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/./../guides/search"
              className="font-poppins font-semibold text-gray-800 hover:text-primary"
            >
              Guides
            </Link>

            <Link
              href="/about"
              className="font-poppins font-semibold text-gray-800 hover:text-primary"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="font-poppins font-semibold text-gray-800 hover:text-primary "
            >
              Contact Us
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-x-2 lg:gap-x-4 ">
            <Link href="/../auth/login">
              <button className="bg-transparent font-medium font-poppins rounded-full px-6 py-2 border border-gray-200 hover:border hover:border-gray-300 hover:shadow-lg text-black  opacity transition duration-300 ">
                Login
              </button>
            </Link>
            <Link href="/../auth/register">
              <button className="bg-red-600 font-medium font-poppins rounded-full border-none shadow-md px-4 py-2 text-white hover:bg-red-500 hover:shadow-lg  hover:transition hover:duration-300 ">
                Sign Up
              </button>
            </Link>
          </div>
          <button
            className="p-2 transition ease-in-out duration-700 md:hidden"
            onClick={toggleMenu}
          >
            <IoMenu className="text-gray-700 text-2xl" />
          </button>

          {/* Mobile device navbar content   */}

          {isOpen && (
            <div
              id="phone-view"
              className="fixed bg-white inset-0 px-3 py-3 md:hidden z-20"
            >
              <div className="px-7 py-2 flex justify-between  items-center">
                <Link href="href">
                  <Image
                    className="object-cover max-w-40 max-h-40"
                    src={logoImg}
                    alt="website logo"
                    width={100}
                    height={100}
                  />
                </Link>
                <button className="p-2 md:hidden" onClick={toggleMenu}>
                  <IoClose className="text-gray-700 text-2xl" />
                </button>
              </div>
              <div className="flex flex-col mt-8 px-7 py-2 ">
                <Link
                  href="/"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  Home
                </Link>
                <Link
                  href="./about"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/faqs"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                >
                  FAQs
                </Link>
              </div>
              <div className="h-[2px] w-full my-4 bg-gray-200"></div>
              <div className="flex flex-col items-center gap-4 mt-4 mx-7 px-6 py-2">
                <button className="bg-transparent font-medium font-poppins rounded-full px-16 py-2 border border-gray-300 text-black hover:bg-red-500 opacity hover:text-white  hover:transition hover:duration-300 ">
                  Login
                </button>
                <button className="bg-red-500 font-medium font-poppins rounded-full border-none shadow-md px-14 py-2 text-white hover:bg-red-600  hover:transition hover:duration-300 ">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
