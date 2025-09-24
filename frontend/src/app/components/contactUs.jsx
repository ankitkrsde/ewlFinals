import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContactUs() {
  return (
    <>
      <div className="w-full flex flex-col">
        <div className="h-[60vh] flex items-center justify-center bg-[url('/contactus.jpg')] bg-no-repeat bg-center bg-cover">
          <div className="flex flex-col gap-2 md:gap-4 items-center justify-center text-center">
            <div className="flex items-center gap-0 md:gap-4 font-poppins text-lg text-gray-700 font-medium">
              <span className="h-[2px] w-16 bg-purple-500"></span>
              <span className=" text-white md:text-gray-800 bg-none md:bg-gray-50 px-4 text-sm sm:text-lg md:text-xl text-center">
                We’re Here to Help You Explore the World
              </span>
              <span className="h-[2px] w-16 bg-purple-500"></span>
            </div>
            <div>
              <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-50 leading-tight text-center">
                Contact Us
              </h1>
            </div>

            {/* <h3 className="text-xl md:text-2xl text-gray-50">
            Discover the World with{" "}
            <span className="text-yellow-400 hover:underline hover:underline-offset-2">
              ExploreWithLocals
            </span>
          </h3> */}
          </div>
        </div>

        <div className="mt-16 px-10 lg:px-24">
          <div className=" mt-4">
            <p className=" text-gray-700 text-lg">
              At ExploreWithLocals, we are dedicated to making your travel
              experience as seamless and enjoyable as possible. Whether you have
              a question about our tours, need assistance with your booking, or
              just want to say hello, we’re here for you!
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
              Get in Touch
            </h3>
            <p className="text-gray-700">
              We’d love to hear from you! Reach out to us using any of the
              methods below, and a member of our friendly team will get back to
              you as soon as possible.
            </p>
            <ul className="flex flex-col gap-4 mt-4">
              <li className="font-semibold text-lg text-gray-800">
                Email :{" "}
                <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                  contact@explorewithlocals.com
                </span>
                <span className="block font-normal text-base text-gray-700">
                  For general inquiries, bookings, or support, drop us an email,
                  and we’ll respond within 24 hours.
                </span>
              </li>
              <li className="font-semibold text-lg text-gray-800">
                Phone :{" "}
                <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                  +123-456-7890
                </span>
                <span className="block font-normal text-base text-gray-700">
                  Prefer to talk to someone directly? Give us a call during our
                  business hours, and we’ll be happy to assist you.
                </span>
              </li>
              <li className="font-semibold text-lg text-gray-800">
                Office Hours :{" "}
                <span className="block font-normal text-base text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </span>
                <span className="block font-normal text-base text-gray-700">
                  Saturday: 10:00 AM - 4:00 PM
                </span>
                <span className="block font-normal text-base text-gray-700">
                  Sunday: Closed
                </span>
              </li>
              <li className="font-semibold text-lg text-gray-800">
                Social Media :{" "}
                <span className="block font-normal text-base text-gray-700">
                  Connect with us on social media! Follow us for the latest
                  updates, travel tips, and inspiration.
                </span>
                <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                  <Link href="https://www.facebook.com">Facebook</Link>
                </span>
                <span className="font-normal text-base px-2">|</span>
                <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                  <Link href="https://www.instagram.com">Instagram</Link>
                </span>
                <span className="font-normal text-base px-2">|</span>
                <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                  <Link href="https://www.twitter.com">Twitter</Link>
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:flex-row  gap-8 mt-16">
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
                Visit Us
              </h3>
              <p className="text-gray-700">
                If you’re in the area, feel free to drop by our office. We’d
                love to meet you in person and help you plan your next
                adventure.
              </p>
              <ul className="flex flex-col gap-2 mt-4">
                <li className="block font-semibold text-lg text-gray-800">
                  Address
                  <span className="block font-normal text-base text-gray-700"></span>
                </li>
                <li>
                  <p className="block font-normal text-base text-gray-700">
                    1299 Pennsylvania Avenue
                  </p>
                  <p className="block font-normal text-base text-gray-700">
                    NW, 10th Floor
                  </p>
                  <p className="block font-normal text-base text-gray-700">
                    Washington, DC
                  </p>
                  <p className="block font-normal text-base text-gray-700">
                    20004
                  </p>
                  <p className="block font-normal text-base text-gray-700">
                    United States
                  </p>
                </li>
              </ul>
            </div>
            <div id="map" className="w-full md:w-1/2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24842.445152333632!2d-77.05195490325254!3d38.89412537153159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b79741a422c5%3A0xe6c57abb35fe7bc0!2s1299%20Pennsylvania%20Avenue%20NW%20%2310th%2C%20Washington%2C%20DC%2020004%2C%20USA!5e0!3m2!1sen!2sin!4v1724742054546!5m2!1sen!2sin"
                width="600"
                height="350"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                className="rounded-sm border-2 border-gray-100 shadow-lg"
              ></iframe>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
              Feedback & Testimonials
            </h3>
            <p className="text-gray-700">
              We value your feedback! Your insights help us improve our services
              and provide the best possible experiences for our travelers. If
              you’ve traveled with us, we’d love to hear about your experience.
              Please send your feedback to{" "}
              <span className="text-purple-500 hover:underline hover:underline-offset-2 cursor-pointer">
                feedback@yourcompany.com
              </span>{" "}
              or share your story on our social media channels.
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-700">
              Have a question? Check out our{" "}
              <Link
                href="/faqs"
                className="text-purple-500 hover:underline hover:underline-offset-2 cursor-pointer"
              >
                FAQ
              </Link>{" "}
              page for answers to some of the most common inquiries. If you
              don’t find what you’re looking for, don’t hesitate to reach out!
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-16 border-2 border-gray-300 rounded-md p-6">
            <div>
              <p className="text-base md:text-lg pt-2 text-purple-500">
                Leave a Message
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 my-4 w-fit">
                We love to hear from you
              </h2>
            </div>
            <div>
              <form action="post" className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 focus:outline-purple-300 shadow-md"
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="px-4 py-3 focus:outline-purple-300 shadow-md"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="px-4 py-3 focus:outline-purple-300 shadow-md"
                />
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="Your Message Here"
                  className="px-4 py-3 focus:outline-purple-300"
                ></textarea>
              </form>
              <div className="mt-6 flex items-center justify-center">
                <button className="bg-red-500 text-white w-fit text-center py-2 px-6 hover:bg-red-600 hover:shadow-purple-300 hover:shadow-md">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
