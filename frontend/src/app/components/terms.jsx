import Image from "next/image";
import React from "react";
import terms from "../../../public/terms.jpg";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="w-full flex flex-col relative">
      <div className="h-[60vh] flex items-center justify-center bg-[url('/terms.jpg')] bg-no-repeat bg-center bg-cover">
        <div className="flex flex-col gap-2 md:gap-4 items-center justify-center text-center">
          <div className="flex items-center gap-0 md:gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className=" text-white md:text-gray-800 bg-none md:bg-gray-50 px-4 text-sm sm:text-lg md:text-xl text-center">
              Guidelines for a Better Experience
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <div>
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-50 leading-tight text-center">
              Term & Conditions
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
          <h3 className="text-2xl md:text-3xl font-bold text-red-500 w-fit pb-4">
            Welcome to Explore With Locals
          </h3>
          <p className=" text-gray-700 text-lg">
            These Terms and Conditions (&quot;Terms&quot;) govern your use of
            our website and services. By accessing our website or booking a tour
            with Explore With Locals, you agree to comply with these Terms.
            Please read them carefully.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          1.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Booking and Payments
          </span>
        </h3>

        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              1.1 Booking Confirmation
            </li>
            <span className="font-normal text-base text-gray-700">
              When you book a tour, sign up for our newsletter, or contact us,
              we may collect personal information such as your name, email
              address, phone number, and payment details.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              1.2 Payment Terms
            </li>
            <span className="font-normal text-base text-gray-700">
              Full payment for your tour is typically due 30 days before the
              departure date unless otherwise specified. We accept major credit
              cards, PayPal, and bank transfers. Failure to pay the balance on
              time may result in the cancellation of your booking.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">1.3 Pricing</li>
            <span className="font-normal text-base text-gray-700">
              All prices are quoted in [Currency] and are subject to change
              without notice. Once your booking is confirmed, the price is
              guaranteed unless there are significant changes in taxes, fees, or
              exchange rates. In such cases, we will notify you of any price
              adjustments.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          2.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Cancellations and Refunds
          </span>
        </h3>

        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              2.1 Cancellation by You
            </li>
            <span className="font-normal text-base text-gray-700">
              If you need to cancel your booking, please notify us as soon as
              possible. Cancellations made 30 days or more before the departure
              date are eligible for a full refund, minus the deposit.
              Cancellations made less than 30 days before departure may be
              subject to partial refunds or credits, depending on the
              circumstances.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              2.2 Cancellation by Explore With Locals
            </li>
            <span className="font-normal text-base text-gray-700">
              We reserve the right to cancel a tour due to unforeseen
              circumstances, such as insufficient bookings, natural disasters,
              or political instability. In such cases, you will be offered a
              full refund or the option to transfer your booking to another
              tour.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              2.3 Non-Refundable Items
            </li>
            <span className="font-normal text-base text-gray-700">
              Certain items, such as travel insurance, visas, and optional
              activities, are non-refundable. Please check the specific terms
              associated with these items before purchasing.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          3.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Changes to Your Booking
          </span>
        </h3>

        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              3.1 Amendments by You
            </li>
            <span className="font-normal text-base text-gray-700">
              If you wish to make changes to your booking, such as changing the
              tour date or adding extra services, please contact us as soon as
              possible. We will do our best to accommodate your request, subject
              to availability and any additional costs.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              3.2 Amendments by Explore With Locals
            </li>
            <span className="font-normal text-base text-gray-700">
              We strive to deliver the itinerary as planned, but we reserve the
              right to make changes to the itinerary, accommodation, or
              transportation if necessary. Any changes will be communicated to
              you promptly, and we will make every effort to provide
              alternatives of equal or higher value.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          4.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Travel Requirements and Responsibilities
          </span>
        </h3>

        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              4.1 Travel Documentation
            </li>
            <span className="font-normal text-base text-gray-700">
              You are responsible for ensuring that you have all necessary
              travel documents, including passports, visas, and any required
              vaccinations. We are not liable for any issues that arise from a
              lack of proper documentation.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              4.2 Travel Insurance
            </li>
            <span className="font-normal text-base text-gray-700">
              We strongly recommend that you purchase comprehensive travel
              insurance to cover trip cancellations, medical emergencies, and
              other unforeseen events. Explore With Locals is not responsible
              for any costs or losses incurred due to a lack of insurance
              coverage.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              4.3 Health and Fitness
            </li>
            <span className="font-normal text-base text-gray-700">
              By booking a tour, you confirm that you are in good health and fit
              to participate in all activities. Please inform us of any medical
              conditions or special needs at the time of booking.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          5.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Limitation of Liability
          </span>
        </h3>
        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              5.1 General Liability
            </li>
            <span className="font-normal text-base text-gray-700">
              Explore With Locals is not liable for any injury, loss, damage, or
              expense arising out of your participation in a tour, except where
              such loss or damage is caused by our negligence. You agree to
              indemnify and hold us harmless from any claims arising from your
              actions or omissions.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              5.2 Third-Party Providers
            </li>
            <span className="font-normal text-base text-gray-700">
              Our tours may include services provided by third-party suppliers,
              such as hotels, airlines, and transport companies. While we take
              care to work with reputable providers, we are not responsible for
              their actions, omissions, or quality of service.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              5.3 Force Majeure
            </li>
            <span className="font-normal text-base text-gray-700">
              Explore With Locals is not liable for any failure to perform our
              obligations under these Terms due to events beyond our control,
              such as natural disasters, war, civil unrest, or strikes.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          6.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Conduct and Behavior
          </span>
        </h3>
        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              6.1 Code of Conduct
            </li>
            <span className="font-normal text-base text-gray-700">
              We expect all travelers to behave respectfully and responsibly
              during the tour. Any disruptive or offensive behavior may result
              in your removal from the tour without a refund.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              6.2 Compliance with Local Laws
            </li>
            <span className="font-normal text-base text-gray-700">
              You are required to comply with all local laws and regulations
              while on tour. [Your Company Name] is not responsible for any
              penalties, fines, or legal issues arising from your failure to
              comply with local laws.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
          7.{" "}
          <span className="border-b-2 border-red-500 w-fit">
            Intellectual Property
          </span>
        </h3>
        <div className="flex flex-col gap-4 mt-4">
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              7.1 Website Content
            </li>
            <span className="font-normal text-base text-gray-700">
              All content on our website, including text, images, and logos, is
              the property of [Your Company Name] and is protected by copyright
              and other intellectual property laws. You may not reproduce,
              distribute, or use any content without our express written
              permission.
            </span>
          </ul>
          <ul>
            <li className="font-semibold text-lg text-gray-800">
              7.2 Trademarks
            </li>
            <span className="font-normal text-base text-gray-700">
              All trademarks, service marks, and trade names used on our website
              are the property of Explore With Locals. Unauthorized use of these
              trademarks is strictly prohibited.
            </span>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
            8.{" "}
            <span className="border-b-2 border-red-500 w-fit">
              Privacy Policy
            </span>
          </h3>
          <p className=" text-gray-700 text-lg">
            Your use of our website and services is also governed by our{" "}
            <Link
              href="/privacy"
              className="text-purple-500 hover:underline hover:underline-offset-2 cursor-pointer"
            >
              Privacy Policy
            </Link>{" "}
            . Please review this policy to understand how we collect, use, and
            protect your personal information.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
            9.{" "}
            <span className="border-b-2 border-red-500 w-fit">
              Governing Law
            </span>
          </h3>
          <p className=" text-gray-700 text-lg">
            These Terms are governed by and construed in accordance with the
            laws of USA. Any disputes arising out of or in connection with these
            Terms shall be subject to the exclusive jurisdiction of the courts
            of USA.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
            10.{" "}
            <span className="border-b-2 border-red-500 w-fit">
              Changes to These Terms
            </span>
          </h3>
          <p className=" text-gray-700 text-lg">
            We reserve the right to update or modify these Terms at any time.
            Any changes will be posted on our website with the updated effective
            date. By continuing to use our services after any changes are made,
            you agree to the revised Terms.
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-16 px-10 lg:px-24">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">
            11.{" "}
            <span className="border-b-2 border-red-500 w-fit">
              Contact Information
            </span>
          </h3>
          <p className=" text-gray-700 text-lg">
            If you have any questions or concerns about these Terms, please
            contact us at:
          </p>
        </div>
        <div>
          <ul className="flex flex-col gap-2 mt-4">
            <li className="font-semibold text-lg text-gray-800">
              Email :{" "}
              <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                contact@explorewithlocals.com
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Phone :{" "}
              <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                +123-456-7890
              </span>
            </li>
            <li className="font-semibold text-lg text-gray-800">
              Address :{" "}
              <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
                1299 Pennsylvania Avenue, NW, 10th Floor, Washington, DC 20004,
                United States
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
