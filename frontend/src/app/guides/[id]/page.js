"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GuideProfile() {
  const params = useParams();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    startTime: "",
    duration: 2,
    numberOfPeople: 1,
    specialRequests: "",
  });

  useEffect(() => {
    fetchGuideData();
  }, [params.id]);

  const fetchGuideData = async () => {
    try {
      const response = await fetch(`/api/guides/${params.id}`);
      const data = await response.json();
      setGuide(data.data.guide);
      setReviews(data.data.reviews);
    } catch (error) {
      console.error("Error fetching guide:", error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to book a guide");
        return;
      }

      const response = await fetch("/api/bookings", {
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
        alert("Booking request sent successfully!");
        setShowBookingForm(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  if (!guide) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Guide Header */}
          <div className="relative">
            <img
              src={guide.userId?.avatar || "/default-avatar.jpg"}
              alt={guide.userId?.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">
                {guide.userId?.name}
              </h1>
              <p className="text-white">{guide.cities?.join(", ")}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Guide Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                <p className="text-gray-700 mb-6">{guide.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold">Languages</h3>
                    <p>{guide.languages?.join(", ")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Specialties</h3>
                    <p>{guide.specialties?.join(", ")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Experience</h3>
                    <p>{guide.experience} years</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Hourly Rate</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      ₹{guide.hourlyRate}
                    </p>
                  </div>
                </div>

                {/* Reviews */}
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 mb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold">
                        {review.touristId?.name}
                      </span>
                      <span className="ml-2 text-yellow-500">
                        ⭐ {review.rating.overall}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Booking Sidebar */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-indigo-600">
                    ₹{guide.hourlyRate}
                  </p>
                  <p className="text-gray-600">per hour</p>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mb-4"
                >
                  Book This Guide
                </button>

                {showBookingForm && (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <input
                      type="date"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={bookingData.date}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={bookingData.startTime}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          startTime: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      min="1"
                      className="w-full border rounded px-3 py-2"
                      placeholder="Number of people"
                      value={bookingData.numberOfPeople}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          numberOfPeople: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      placeholder="Special requests"
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          specialRequests: e.target.value,
                        })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded"
                    >
                      Send Booking Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
