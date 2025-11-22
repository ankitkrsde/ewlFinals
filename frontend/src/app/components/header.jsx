"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/logo.png";
import { useAuth } from "./AuthProvider"; // Import the hook

/*React icons*/
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // Use the hook

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  const handleLogout = () => {
    logout();
    toggleMenu(); // Close mobile menu after logout
  };

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
              href="/../guides/search"
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

            {/* Role-based navigation links - Desktop */}
            {user && (
              <>
                {/* Admin link - only show for admin users */}
                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="font-poppins font-semibold text-gray-800 hover:text-primary"
                  >
                    Admin
                  </Link>
                )}

                {/* Profile link - show for all logged in users */}
                <Link
                  href="/profile"
                  className="font-poppins font-semibold text-gray-800 hover:text-primary"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-x-2 lg:gap-x-4">
            {loading ? (
              <div>Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-x-4">
                {/* Dashboard Button - Added here */}
                <Link href="/dashboard">
                  <button className="bg-blue-600 font-medium font-poppins rounded-full px-4 py-2 text-white hover:bg-blue-500 hover:shadow-lg transition duration-300">
                    Dashboard
                  </button>
                </Link>
                <span className="font-poppins text-gray-800">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-transparent font-medium font-poppins rounded-full px-6 py-2 border border-gray-200 hover:border hover:border-gray-300 hover:shadow-lg text-black opacity transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/../auth/login">
                  <button className="bg-transparent font-medium font-poppins rounded-full px-6 py-2 border border-gray-200 hover:border hover:border-gray-300 hover:shadow-lg text-black opacity transition duration-300">
                    Login
                  </button>
                </Link>
                <Link href="/../auth/register">
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
                <Link href="/">
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
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={toggleMenu}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                  onClick={toggleMenu}
                >
                  Contact Us
                </Link>

                {/* Role-based navigation links - Mobile */}
                {user && (
                  <>
                    {/* Admin link - only show for admin users */}
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                        onClick={toggleMenu}
                      >
                        Admin
                      </Link>
                    )}

                    {/* Profile link - show for all logged in users */}
                    <Link
                      href="/profile"
                      className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* Dashboard Link in Mobile Menu - Only show if user is logged in */}
                {user && (
                  <Link
                    href="/dashboard"
                    className="mx-3 my-3 p-3 hover:bg-gray-200 font-poppins block font-semibold text-gray-800 rounded-md"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="h-[2px] w-full my-4 bg-gray-200"></div>
              <div className="flex flex-col items-center gap-4 mt-4 mx-7 px-6 py-2">
                {loading ? (
                  <div>Loading...</div>
                ) : user ? (
                  <>
                    <span className="font-poppins text-gray-800 text-center">
                      Welcome, {user.name}
                    </span>
                    {/* Dashboard Button in Mobile Auth Section */}
                    <Link href="/dashboard" className="w-full text-center">
                      <button
                        className="bg-blue-600 font-medium font-poppins rounded-full px-16 py-2 text-white hover:bg-blue-500 hover:transition hover:duration-300 w-full"
                        onClick={toggleMenu}
                      >
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-transparent font-medium font-poppins rounded-full px-16 py-2 border border-gray-300 text-black hover:bg-red-500 hover:text-white hover:transition hover:duration-300 w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/../auth/login" className="w-full text-center">
                      <button
                        className="bg-transparent font-medium font-poppins rounded-full px-16 py-2 border border-gray-300 text-black hover:bg-red-500 opacity hover:text-white hover:transition hover:duration-300 w-full"
                        onClick={toggleMenu}
                      >
                        Login
                      </button>
                    </Link>
                    <Link
                      href="/../auth/register"
                      className="w-full text-center"
                    >
                      <button
                        className="bg-red-500 font-medium font-poppins rounded-full border-none shadow-md px-14 py-2 text-white hover:bg-red-600 hover:transition hover:duration-300 w-full"
                        onClick={toggleMenu}
                      >
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
