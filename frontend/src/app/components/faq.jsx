"use client";

import React, { useState } from "react";
import Image from "next/image";
import faq from "../../../public/faq.jpg";
import faqData from "./faqData";

export default function Faq() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  function toggle(index) {
    if (selectedIndex === index) {
      return setSelectedIndex(null);
    }
    setSelectedIndex(index);
  }

  const handleEmailClick = () => {
    window.location.href = "mailto:contact@explorewithlocals.com";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+91-9876543210";
  };

  return (
    <div className="w-full flex flex-col mb-24">
      <div className="h-[60vh] flex items-center justify-center bg-[url('/faq.jpg')] bg-no-repeat bg-center bg-cover">
        <div className="flex flex-col gap-2 md:gap-4 items-center justify-center text-center">
          <div className="flex items-center gap-0 md:gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className=" text-white md:text-gray-800 bg-none md:bg-gray-50 px-4 text-sm sm:text-lg md:text-xl text-center">
              Got Questions? We&apos;ve Got Answers
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <div>
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-50 leading-tight text-center">
              FAQs
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Frequently Asked Questions (FAQ)
        </h3>
        <p className="text-gray-700">
          Planning a trip can be exciting, but we understand that you might have
          some questions along the way. Below are some of the most common
          questions we receive from travelers like you. If you don't find the
          answer you're looking for, feel free to contact us directly!
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48">
        {faqData.map((item, index) => (
          <div
            key={item.id}
            className="px-6 py-4 border border-purple-500 rounded-md bg-gray-50 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggle(index)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl text-gray-800 font-semibold pr-4">
                {item.question}
              </h2>
              <span className="text-2xl text-red-500 font-bold flex-shrink-0">
                {selectedIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className={
                selectedIndex === index
                  ? "max-h-96 h-auto overflow-hidden transition-all duration-500 ease-in-out pt-4"
                  : "max-h-0 overflow-hidden transition-all duration-500 ease-in-out"
              }
            >
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-48">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          Still Have Questions?
        </h3>
        <p className="text-gray-700">
          If you didn't find the answer to your question, don't worry! You can
          reach out to us at{" "}
          <span
            onClick={handleEmailClick}
            className="text-purple-500 hover:underline hover:underline-offset-2 cursor-pointer"
          >
            contact@explorewithlocals.com
          </span>{" "}
          or call us at{" "}
          <span
            onClick={handlePhoneClick}
            className="text-purple-500 hover:underline hover:underline-offset-2 cursor-pointer"
          >
            +91-9876543210
          </span>
          . We're here to help make your travel experience as smooth as
          possible!
        </p>
      </div>
    </div>
  );
}
