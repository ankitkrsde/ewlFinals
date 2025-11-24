"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/components/AuthProvider";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GuideProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    startTime: "09:00",
    duration: 2,
    numberOfPeople: 1,
    meetingPoint: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState({
    show: false,
    message: "",
    type: "",
  });

  const fetchGuideData = useCallback(async () => {
    try {
      console.log("🌐 Fetching guide data for ID:", params.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/guides/${params.id}`
      );

      console.log("✅ Response status:", response.status);

      const data = await response.json();
      console.log("📦 API Response:", data);

      if (data.success) {
        setGuide(data.data.guide);
        setReviews(data.data.reviews || []);
        console.log("👤 Guide data loaded:", data.data.guide.userId?.name);
      } else {
        setError(data.message || "Guide not found");
        console.error("❌ API Error:", data.message);
      }
    } catch (error) {
      console.error("💥 Fetch Error:", error);
      setError("Failed to load guide profile");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    console.log("🔍 Guide ID from URL:", params.id);
    fetchGuideData();
  }, [fetchGuideData, params.id]);

  // Add this function for notifications
  const showBookingStatus = (message, type = "success") => {
    setBookingStatus({ show: true, message, type });

    setTimeout(() => {
      setBookingStatus({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    console.log("📦 Booking data:", bookingData);
    console.log("👤 Guide ID:", guide?.userId?._id);

    const token = localStorage.getItem("token");
    if (!token) {
      showBookingStatus("Please login to book a guide", "error");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guideId: guide.userId._id,
          date: bookingData.date,
          startTime: bookingData.startTime,
          duration: bookingData.duration,
          meetingPoint: bookingData.meetingPoint,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests,
        }),
      });

      console.log("✅ Booking response status:", response.status);

      const result = await response.json();
      console.log("📦 Booking API response:", result);

      if (result.success) {
        // REPLACED ALERT WITH NOTIFICATION
        showBookingStatus(
          "🎉 Booking request sent successfully! The guide will respond soon.",
          "success"
        );

        setShowBookingForm(false);
        setBookingData({
          date: "",
          startTime: "09:00",
          duration: 2,
          numberOfPeople: 1,
          meetingPoint: "",
          specialRequests: "",
        });
      } else {
        // REPLACED ALERT WITH NOTIFICATION
        showBookingStatus(
          result.message || "Booking failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("💥 Booking error:", error);
      // REPLACED ALERT WITH NOTIFICATION
      showBookingStatus("Network error. Please try again.", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading guide profile...</div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            {error || "Guide not found"}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Guide ID: {params.id}
          </div>
          <Link
            href="/guides/search"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = guide.hourlyRate * bookingData.duration;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Booking Status Notification */}
        {bookingStatus.show && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border ${
              bookingStatus.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            } shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  bookingStatus.type === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                } text-white text-sm font-bold`}
              >
                {bookingStatus.type === "success" ? "✓" : "!"}
              </div>
              <div>
                <p className="font-semibold">
                  {bookingStatus.type === "success" ? "Success!" : "Error"}
                </p>
                <p className="text-sm">{bookingStatus.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/guides/search"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Guides
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-500">{guide.userId?.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Guide Header */}
          <div className="relative">
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end space-x-6">
                {/* Fixed Avatar */}
                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-white">
                  <span className="text-white text-2xl font-bold">
                    {guide.userId?.name?.charAt(0) || "G"}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {guide.userId?.name}
                  </h1>
                  <p className="text-lg opacity-90">
                    {guide.cities?.join(", ")}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold mr-2">
                      ⭐ {guide.rating?.average?.toFixed(1) || "New"}
                    </span>
                    <span className="text-sm">
                      ({guide.rating?.count || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Guide Info */}
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {guide.bio || "No biography provided yet."}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-3">Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">
                          {guide.experience || 0} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Languages:</span>
                        <span className="font-medium">
                          {guide.languages?.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialties:</span>
                        <span className="font-medium">
                          {guide.specialties?.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Rate:</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">Within 2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold text-sm">
                                {review.touristId?.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {review.touristId?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-1">⭐</span>
                                <span>{review.rating.overall}</span>
                                <span className="mx-2">•</span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this guide!
                    </p>
                  )}
                </section>
              </div>

              {/* Right Column - Booking Sidebar */}
              <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-indigo-600">
                    ₹{guide.hourlyRate}
                  </p>
                  <p className="text-gray-600">per hour</p>
                </div>

                {/* Only show booking button if user is NOT a guide */}
                {user?.role !== "guide" && (
                  <>
                    {!showBookingForm ? (
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold mb-4"
                      >
                        Book This Guide
                      </button>
                    ) : (
                      <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={bookingData.date}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            required
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={bookingData.startTime}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                startTime: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (hours)
                          </label>
                          <select
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={bookingData.duration}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                duration: parseInt(e.target.value),
                              })
                            }
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                              <option key={hours} value={hours}>
                                {hours} hour{hours > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of People
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={bookingData.numberOfPeople}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                numberOfPeople: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Point
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Where should you meet?"
                            value={bookingData.meetingPoint}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                meetingPoint: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Requests
                          </label>
                          <textarea
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any special requirements?"
                            rows="3"
                            value={bookingData.specialRequests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                specialRequests: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span>
                              Guide Fee ({bookingData.duration} hours):
                            </span>
                            <span>
                              ₹{guide.hourlyRate * bookingData.duration}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span className="text-indigo-600">
                              ₹{totalPrice}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={bookingLoading}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                        >
                          {bookingLoading
                            ? "Sending Request..."
                            : "Send Booking Request"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </>
                )}

                {/* Show message for guides instead of booking form */}
                {user?.role === "guide" && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium mb-2">
                      👋 Hello Fellow Guide!
                    </p>
                    <p className="text-blue-600 text-sm">
                      You're viewing another guide's profile. To manage your own
                      profile, visit your dashboard.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Go to My Profile
                    </Link>
                  </div>
                )}

                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>✔️ Free cancellation up to 24 hours before</p>
                  <p>✔️ Instant confirmation</p>
                  <p>✔️ Secure payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
