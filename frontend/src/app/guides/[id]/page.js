"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function GuideProfilePage() {
  const params = useParams();
  const router = useRouter();
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

  useEffect(() => {
    fetchGuideData();
  }, [params.id]);

  const fetchGuideData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/guides/${params.id}`
      );
      const data = await response.json();

      if (data.success) {
        setGuide(data.data.guide);
        setReviews(data.data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching guide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a guide");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guideId: guide.userId._id,
          ...bookingData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Booking request sent successfully! The guide will respond soon."
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
        alert(result.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
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

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Guide not found</div>
      </div>
    );
  }

  const totalPrice = guide.hourlyRate * bookingData.duration;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
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
            <img
              src={guide.userId?.avatar || "/default-avatar.jpg"}
              alt={guide.userId?.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{guide.userId?.name}</h1>
              <p className="text-lg opacity-90">{guide.cities?.join(", ")}</p>
              <div className="flex items-center mt-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold mr-2">
                  ⭐ {guide.rating?.average || "New"}
                </span>
                <span className="text-sm">
                  ({guide.rating?.count || 0} reviews)
                </span>
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
                    <h3 className="font-semibold mb-3">Verification</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${
                            guide.verificationStatus === "approved"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {guide.verificationStatus === "approved"
                            ? "Verified"
                            : "Pending Verification"}
                        </span>
                      </div>
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
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                              <span className="font-semibold">
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

                          {review.rating.knowledge && (
                            <div className="mt-2 text-sm text-gray-600">
                              Knowledge: {review.rating.knowledge}/5 •
                              Communication: {review.rating.communication}/5 •
                              Punctuality: {review.rating.punctuality}/5
                            </div>
                          )}
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
                        <span>Guide Fee ({bookingData.duration} hours):</span>
                        <span>₹{guide.hourlyRate * bookingData.duration}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-indigo-600">₹{totalPrice}</span>
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
