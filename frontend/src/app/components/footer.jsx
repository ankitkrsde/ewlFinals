"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutubeSquare } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform) => {
    // In a real app, these would link to your actual social media pages
    const socialLinks = {
      facebook: "https://facebook.com/explorewithlocals",
      instagram: "https://instagram.com/explorewithlocals",
      twitter: "https://twitter.com/explorewithlocals",
      youtube: "https://youtube.com/explorewithlocals",
    };

    // For now, just open a new tab with a placeholder
    window.open(socialLinks[platform], "_blank");
  };

  const handleWorkWithUsClick = (option) => {
    switch (option) {
      case "tour-guide":
        // Redirect to guide application or scroll to guide section
        if (window.location.pathname === "/") {
          document
            .getElementById("become-guide-section")
            ?.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "/#become-guide-section";
        }
        break;
      case "affiliate":
        alert("Affiliate program coming soon!");
        break;
      case "careers":
        alert("Career opportunities coming soon!");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="w-full px-10 lg:px-24 pt-12 flex flex-col p-6 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div id="logo" className="flex items-start">
          <Link href="/">
            <Image
              src={logo}
              alt="ExploreWithLocals - Connect with local guides across India"
              width={100}
              height={100}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
          </Link>
        </div>
        <span className="w-full h-[1px] bg-gray-50 opacity-40 my-8"></span>

        <div
          id="links"
          className="grid grid-cols-1 gap-12 sm:grid sm:grid-cols-2 sm:gap-10 lg:flex items-start justify-between my-6"
        >
          {/* Company */}
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg font-semibold">
              ExploreWithLocals
            </h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <Link href="/about">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  About Us
                </p>
              </Link>
              <Link href="/blog">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  Blog
                </p>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg font-semibold">Support</h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <Link href="/contact">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  Contact Us
                </p>
              </Link>
              <Link href="/terms">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  Terms & Conditions
                </p>
              </Link>
              <Link href="/privacy">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  Privacy Policy
                </p>
              </Link>
              <Link href="/faqs">
                <p className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200">
                  FAQs
                </p>
              </Link>
            </div>
          </div>

          {/* Work With Us */}
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg font-semibold">
              Work With Us
            </h3>
            <div className="flex flex-col gap-4 cursor-pointer">
              <p
                className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200"
                onClick={() => handleWorkWithUsClick("tour-guide")}
              >
                Become a Guide
              </p>
              <p
                className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200"
                onClick={() => handleWorkWithUsClick("affiliate")}
              >
                Affiliate Program
              </p>
              <p
                className="w-fit hover:underline hover:underline-offset-4 hover:transition-all hover:text-yellow-200"
                onClick={() => handleWorkWithUsClick("careers")}
              >
                Careers
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col gap-5 text-gray-50">
            <h3 className="text-yellow-400 text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4 cursor-pointer">
              <button
                onClick={() => handleSocialClick("facebook")}
                className="w-fit hover:text-yellow-200 hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookSquare size={30} />
              </button>
              <button
                onClick={() => handleSocialClick("instagram")}
                className="w-fit hover:text-yellow-200 hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <FaInstagramSquare size={30} />
              </button>
              <button
                onClick={() => handleSocialClick("twitter")}
                className="w-fit hover:text-yellow-200 hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <FaSquareXTwitter size={30} />
              </button>
              <button
                onClick={() => handleSocialClick("youtube")}
                className="w-fit hover:text-yellow-200 hover:scale-110 transition-all duration-300"
                aria-label="Follow us on YouTube"
              >
                <FaYoutubeSquare size={30} />
              </button>
            </div>
          </div>
        </div>

        <span className="w-full h-[1px] bg-gray-50 opacity-40 mt-8 mb-8"></span>

        <div className="text-center text-white text-md">
          <p>
            ExploreWithLocals{" "}
            <span className="text-yellow-400">© {currentYear}</span> |
            <span className="text-yellow-200 ml-2">
              Connecting travelers with authentic local experiences across India
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
