"use client";
import React, { useState } from "react";
import Image from "next/image";
import guide1 from "../../../public/guide1.jpg";
import { PiHandTapLight } from "react-icons/pi";
import { useAuth } from "./AuthProvider";

// Add this at the top - API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Guide({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    experience: "",
    specialties: [],
    languages: [],
    cities: [],
    bio: "",
    hourlyRate: "",
    whyBecomeGuide: "",
  });
  const [loading, setLoading] = useState(false);
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  const specialtiesOptions = [
    "Historical",
    "Cultural",
    "Food",
    "Adventure",
    "Nature",
    "Photography",
    "Shopping",
    "Architecture",
    "Wildlife",
    "Spiritual",
  ];

  const languageOptions = [
    "Hindi",
    "English",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Malayalam",
    "Kannada",
    "Other",
  ];

  const handleSpecialtyChange = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login to apply as a guide");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        // ✅ FIXED
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          "Application submitted successfully! We will review your application and get back to you soon."
        );
        setShowForm(false);
        setFormData({
          experience: "",
          specialties: [],
          languages: [],
          cities: [],
          bio: "",
          hourlyRate: "",
          whyBecomeGuide: "",
        });
      } else {
        alert(
          data.message || "Failed to submit application. Please try again."
        );
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!currentUser) {
      alert("Please login to apply as a guide");
      return;
    }
    setShowForm(true);
  };

  return (
    <>
      <div className="w-full mt-24 mb-24 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
            <span className="h-[2px] w-16 bg-purple-500"></span>
            <span className="text-lg md:text-xl">
              Guide the world with your passion
            </span>
            <span className="h-[2px] w-16 bg-purple-500"></span>
          </div>
          <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-red-500 leading-tight">
            Become a Guide
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Share your local knowledge, earn money, and help travelers discover
            authentic experiences
          </p>
        </div>

        <div id="bg-image" className="relative  w-full max-w-6xl mx-auto">
          <div className="brightness-50 rounded-lg overflow-hidden">
            <Image
              src={guide1}
              alt="Local guide showing tourists around"
              width={2500}
              height={500}
              className="h-[14vh] sm:h-auto object-cover"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 sm:px-10 md:px-24 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full">
            <div className="text-center">
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed drop-shadow-lg">
                "We're pioneers, storytellers, and explorers of the unbeaten
                path, dedicated to those who crave unique travel experiences. If
                you're eager to join a community of innovative local tour guides
                who excel at crafting unforgettable journeys, we'd love to
                connect with you"
              </p>
            </div>
            <button
              onClick={handleApplyClick}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-red-500 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500 hover:border-red-600 transition-all duration-300 group"
            >
              <span className="text-white font-medium text-sm sm:text-base md:text-lg">
                Apply Now
              </span>
              <PiHandTapLight
                size={24}
                className="text-white group-hover:scale-110 transition-transform"
              />
            </button>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-4 text-white">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">₹25,000+</div>
                <div className="text-xs sm:text-sm">Avg. Monthly Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">95%</div>
                <div className="text-xs sm:text-sm">Verified Guides</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Apply to Become a Guide
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience as a Guide
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      placeholder="Enter years of experience"
                    />
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Specialties (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {specialtiesOptions.map((specialty) => (
                        <label
                          key={specialty}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => handleSpecialtyChange(specialty)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages You Speak (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {languageOptions.map((language) => (
                        <label
                          key={language}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.languages.includes(language)}
                            onChange={() => handleLanguageChange(language)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cities Where You Can Guide
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.cities}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cities: e.target.value
                            .split(",")
                            .map((c) => c.trim()),
                        })
                      }
                      placeholder="Enter cities separated by commas (e.g., Delhi, Mumbai, Goa)"
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Hourly Rate (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        setFormData({ ...formData, hourlyRate: e.target.value })
                      }
                      placeholder="Enter your expected hourly rate"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About You & Your Guiding Style
                    </label>
                    <textarea
                      rows="3"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself and your approach to guiding..."
                    />
                  </div>

                  {/* Why Become Guide */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why Do You Want to Become a Guide?
                    </label>
                    <textarea
                      rows="3"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.whyBecomeGuide}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whyBecomeGuide: e.target.value,
                        })
                      }
                      placeholder="Share your motivation for becoming a local guide..."
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
