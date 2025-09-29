"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/logo.png";

/*React icons*/
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

// Safe hook that won't break if AuthProvider is missing
function useAuthSafe() {
  try {
    // Try to import and use the auth hook
    const { useAuth } = require("./AuthProvider");
    return useAuth();
  } catch (error) {
    // Return default values if AuthProvider is not available
    return {
      user: null,
      logout: () => {},
      loading: false,
    };
  }
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuthSafe(); // Use the safe hook

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    // Force page refresh to clear any state
    window.location.href = "/";
  };

  // Simple auth check without context (fallback)
  const getAuthState = () => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // Use context user or fallback to localStorage check
  const currentUser = user || getAuthState();

  return (
    <>
      <header className="">
        <nav className="px-10 lg:px-36 py-1 flex justify-between items-center bg-white shadow-md z-30">
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
              href="/guides/search"
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
              className="font-poppins font-semibold text-gray-800 hover:text-primary"
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Auth Buttons - Updated with conditional rendering */}
          <div className="hidden md:flex items-center gap-x-2 lg:gap-x-4">
            {currentUser ? (
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold text-sm">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-poppins font-semibold text-gray-800">
                    Hi, {currentUser.name}
                  </span>
                </div>
                <Link href="/dashboard">
                  <button className="bg-red-600 font-medium font-poppins rounded-full border-none shadow-md px-4 py-2 text-white hover:bg-red-500 hover:shadow-lg hover:transition hover:duration-300">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-transparent font-medium font-poppins rounded-full px-4 py-2 border border-gray-200 hover:border hover:border-gray-300 hover:shadow-lg text-black opacity transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="bg-transparent font-medium font-poppins rounded-full px-6 py-2 border border-gray-200 hover:border hover:border-gray-300 hover:shadow-lg text-black opacity transition duration-300">
                    Login
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="bg-red-600 font-medium font-poppins rounded-full border-none shadow-md px-4 py-2 text-white hover:bg-red-500 hover:shadow-lg hover:transition hover:duration-300">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          <button
            className="p-2 transition ease-in-out duration-700 md:hidden"
            onClick={toggleMenu}
          >
            <IoMenu className="text-gray-700 text-2xl" />
          </button>

          {/* Mobile device navbar content */}
          {isOpen && (
            <div
              id="phone-view"
              className="fixed bg-white inset-0 px-3 py-3 md:hidden z-20"
            >
              <div className="px-7 py-2 flex justify-between items-center">
                <Link href="/" onClick={() => setIsOpen(false)}>
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

              <div className="flex flex-col mt-8 px-7 py-2">
                <Link
                  href="/"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/guides/search"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Guides
                </Link>
                <Link
                  href="/about"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>

                {/* Conditional mobile auth links */}
                {currentUser ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="mx-3 my-3 p-3 font-poppins block font-semibold text-gray-800 rounded-md">
                      Welcome, {currentUser.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md text-left w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/privacy"
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Terms & Conditions
                    </Link>
                    <Link
                      href="/faqs"
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      FAQs
                    </Link>
                  </>
                )}
              </div>

              <div className="h-[2px] w-full my-4 bg-gray-200"></div>

              {/* Conditional mobile auth buttons */}
              <div className="flex flex-col items-center gap-4 mt-4 mx-7 px-6 py-2">
                {currentUser ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="bg-red-600 font-medium font-poppins rounded-full border-none shadow-md w-full py-2 text-white hover:bg-red-500 hover:transition hover:duration-300">
                        Go to Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-transparent font-medium font-poppins rounded-full px-16 py-2 border border-gray-300 text-black hover:bg-gray-100 w-full transition duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="bg-transparent font-medium font-poppins rounded-full px-16 py-2 border border-gray-300 text-black hover:bg-red-500 hover:text-white w-full transition duration-300">
                        Login
                      </button>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="bg-red-500 font-medium font-poppins rounded-full border-none shadow-md px-14 py-2 text-white hover:bg-red-600 w-full transition duration-300">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
