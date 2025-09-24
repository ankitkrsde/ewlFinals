import React from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutubeSquare } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="w-full px-10 lg:px-24  pt-12 flex flex-col p-6 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div id="logo" className="flex items-start">
          <div>
            <Image src={logo} alt="logo" width={100} height={100} />
          </div>
        </div>
        <span className="w-full h-[1px] bg-gray-50 opacity-40 my-8"></span>

        <div
          id="links"
          className="grid grid-cols-1 gap-12 sm:grid sm:grid-cols-2 sm:gap-10 lg:flex items-start justify-between my-6"
        >
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg">ExploreWithLocals</h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <Link href="/about">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                  About Us
                </p>
              </Link>
              <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                Blog
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg">Support</h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <Link href="/contact">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                  Contact Us
                </p>
              </Link>
              <Link href="/terms">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                  Terms & Conditions
                </p>
              </Link>
              <Link href="/privacy">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                  Privacy Policy
                </p>
              </Link>
              <Link href="/faqs">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                  FAQs
                </p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg">Work With Us</h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                Tour Guide
              </p>
              <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                Affilliate
              </p>
              <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all">
                Careers
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg">Follow Us</h3>
            {/* <div className="flex flex-col gap-4 cursor-pointer">
              <p className="w-fit hover:border-b hover:border-yellow-400 hover:transition-all">
                Facebook
              </p>
              <p className="w-fit hover:border-b hover:border-yellow-400 hover:transition-all">
                Instagram
              </p>
              <p className="w-fit hover:border-b hover:border-yellow-400 hover:transition-all">
                Twitter
              </p>
              <p className="w-fit hover:border-b hover:border-yellow-400 hover:transition-all">
                Youtube
              </p>
            </div> */}
            <div className="flex gap-4 cursor-pointer">
              <p className="w-fit hover:text-yellow-200 hover:transition-all">
                <FaFacebookSquare size={30} />
              </p>
              <p className="w-fit hover:text-yellow-200 hover:transition-all">
                <FaInstagramSquare size={30} />
              </p>
              <p className="w-fit hover:text-yellow-200 hover:transition-all">
                <FaSquareXTwitter size={30} />
              </p>
              <p className="w-fit hover:text-yellow-200 hover:transition-all">
                <FaYoutubeSquare size={30} />
              </p>
            </div>
          </div>
        </div>
        <span className="w-full h-[1px] bg-gray-50 opacity-40 mt-8 mb-8"></span>
        <p className="text-center text-white text-md">
          ExploreWithLocals <span className="text-yellow-400">© 2024</span>{" "}
        </p>
      </div>
    </>
  );
}
