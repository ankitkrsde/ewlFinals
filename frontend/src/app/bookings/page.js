"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                      filter === tab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab} (
                    {tab === "all"
                      ? bookings.length
                      : bookings.filter((b) => b.status === tab).length}
                    )
                  </button>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Tour with {booking.guideId?.name || "Guide"}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at{" "}
                      {booking.startTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">
                      {booking.duration} hours
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">People:</span>
                    <span className="ml-2 font-medium">
                      {booking.numberOfPeople}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-medium text-indigo-600">
                      ₹{booking.price}
                    </span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-4">
                    <span className="text-gray-500">Special Requests:</span>
                    <p className="mt-1">{booking.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  <div className="space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                      View Details
                    </button>
                    {booking.status === "pending" && (
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Cancel
                      </button>
                    )}
                    {booking.status === "completed" && !booking.review && (
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Add Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No bookings found</p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-indigo-600 hover:text-indigo-800 mt-2"
                >
                  View all bookings
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
