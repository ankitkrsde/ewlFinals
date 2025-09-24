import Image from "next/image";
import React from "react";
import privacy from "../../../public/privacy.jpg";

export default function Privacy() {
  return (
    <div className="w-full flex flex-col">
      <div className="h-[60vh] flex items-center justify-center bg-[url('/privacy.jpg')] bg-no-repeat bg-center bg-cover">
        <div className="flex flex-col gap-2 md:gap-4 items-center justify-center text-center">
          <div className="flex items-center gap-0 md;gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className=" text-white md:text-gray-800 bg-none md:bg-gray-50 px-4 text-sm sm:text-lg md:text-xl text-center">
              Your Privacy, Our Priority
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <div>
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-50 leading-tight text-center">
              Privacy Policy
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
            At ExploreWithLocals,we are committed to protecting your personal
            information and respecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your information when
            you visit our website or use our services. By accessing our website
            and using our services, you agree to the practices described in this
            policy.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Information We Collect
        </h3>
        <p className="text-gray-700">
          We collect various types of information to provide and improve our
          services:
        </p>
        <ul className="flex flex-col gap-4 mt-4">
          <li className="font-semibold text-lg text-gray-800">
            Personal Information :{" "}
            <span className="font-normal text-base text-gray-700">
              When you book a tour, sign up for our newsletter, or contact us,
              we may collect personal information such as your name, email
              address, phone number, and payment details.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Technical Information :{" "}
            <span className="font-normal text-base text-gray-700">
              We may collect technical data such as your IP address, browser
              type, operating system, and browsing behavior to help us
              understand how you interact with our website.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Cookies :{" "}
            <span className="font-normal text-base text-gray-700">
              We use cookies and similar technologies to enhance your experience
              on our website. Cookies help us remember your preferences and
              personalize your visit. You can manage your cookie preferences
              through your browser settings.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          How We Use Your Information
        </h3>
        <p className="text-gray-700">
          We use the information we collect for the following purposes:
        </p>
        <ul className="flex flex-col gap-4 mt-4">
          <li className="font-semibold text-lg text-gray-800">
            To Provide Services :{" "}
            <span className="font-normal text-base text-gray-700">
              We use your personal information to process bookings, communicate
              with you, and provide the services you have requested.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            To Improve Our Website :{" "}
            <span className="font-normal text-base text-gray-700">
              Technical information helps us analyze site performance and user
              behavior, allowing us to improve our website and services
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Marketing Communications :{" "}
            <span className="font-normal text-base text-gray-700">
              With your consent, we may use your contact information to send you
              promotional materials, special offers, and travel tips. You can
              opt out of these communications at any time.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Legal Compliance :{" "}
            <span className="font-normal text-base text-gray-700">
              We may use your information to comply with legal obligations,
              prevent fraud, and protect our rights and the rights of others.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          How We Share Your Information
        </h3>
        <p className="text-gray-700">
          We respect your privacy and do not sell your personal information.
          However, we may share your information in the following circumstances:
        </p>
        <ul className="flex flex-col gap-4 mt-4">
          <li className="font-semibold text-lg text-gray-800">
            Service Providers :{" "}
            <span className="font-normal text-base text-gray-700">
              We may share your information with trusted third-party service
              providers who assist us in delivering our services, such as
              payment processors, tour operators, and email marketing platforms.
              These providers are contractually obligated to protect your
              information and use it only for the purposes specified by us.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Legal Requirements :{" "}
            <span className="font-normal text-base text-gray-700">
              We may disclose your information if required by law, court order,
              or government regulation, or if such disclosure is necessary to
              protect our rights or the rights of others.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Business Transfers :{" "}
            <span className="font-normal text-base text-gray-700">
              In the event of a merger, acquisition, or sale of our business,
              your information may be transferred to the new owners as part of
              the transaction.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Data Security
        </h3>
        <p className="text-gray-700">
          We take data security seriously and implement appropriate technical
          and organizational measures to protect your personal information from
          unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission over the Internet or electronic storage is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Your Rights
        </h3>
        <p className="text-gray-700">
          You have certain rights regarding your personal information:
        </p>
        <ul className="flex flex-col gap-4 mt-4">
          <li className="font-semibold text-lg text-gray-800">
            Access and Correction :{" "}
            <span className="font-normal text-base text-gray-700">
              You can request access to the personal information we hold about
              you and ask us to correct any inaccuracies.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Deletion :{" "}
            <span className="font-normal text-base text-gray-700">
              You have the right to request the deletion of your personal
              information, subject to certain legal obligations
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Opt-Out :{" "}
            <span className="font-normal text-base text-gray-700">
              You can opt out of receiving marketing communications from us by
              following the unsubscribe instructions in our emails or contacting
              us directly.
            </span>
          </li>
          <li className="font-semibold text-lg text-gray-800">
            Data Portability :{" "}
            <span className="font-normal text-base text-gray-700">
              In some cases, you may request a copy of your personal information
              in a structured, commonly used format.
            </span>
          </li>
        </ul>
        <p className="text-gray-700">
          To exercise any of these rights, please contact us at{" "}
          <span className=" font-normal text-base text-purple-500 cursor-pointer hover:underline hover:underline-offset-2">
            privacy@yourcompany.com
          </span>
          .
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          International Transfers
        </h3>
        <p className="text-gray-700">
          As we operate globally, your information may be transferred to and
          processed in countries outside of your home country. We ensure that
          any international transfers of your personal information are carried
          out in accordance with applicable data protection laws.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Third-Party Links
        </h3>
        <p className="text-gray-700">
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these external
          sites. We encourage you to review the privacy policies of any
          third-party websites you visit.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Changes to This Policy
        </h3>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We will notify you of any
          significant changes by posting the updated policy on our website with
          a new effective date.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-16 px-10 lg:px-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-red-500 w-fit">
          Contact Us
        </h3>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy or how
          we handle your personal information, please contact us at:
        </p>
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
  );
}
