"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function GuideBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const router = useRouter();

  const fetchBookings = useCallback(async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`, {
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "guide") {
      router.push("/auth/login");
      return;
    }

    fetchBookings(token);
  }, [router, fetchBookings]);

  const showBookingStatus = (message, type = "success") => {
    setBookingStatus({ show: true, message, type });

    setTimeout(() => {
      setBookingStatus({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Fixed updateBookingStatus function
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      console.log("🔄 Attempting to update booking status:", {
        bookingId,
        newStatus,
      });

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        showBookingStatus("Please login again", "error");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log("📊 Response status:", response.status);

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Full response:", result);

      if (result.success) {
        console.log("✅ Status updated successfully");
        fetchBookings(token);
        showBookingStatus(
          `Booking marked as ${newStatus} successfully!`,
          "success"
        );
      } else {
        console.error("❌ Update failed:", result.message);
        showBookingStatus(
          `Failed to update status: ${result.message}`,
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      showBookingStatus(
        "Error updating booking status. Please try again.",
        "error"
      );
    }
  };

  // Modern confirmation function
  const handleStatusUpdate = (bookingId, newStatus, actionName) => {
    setPendingAction({ bookingId, newStatus, actionName });
    setShowConfirmation(true);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Booking Requests
        </h1>

        {/* Modern Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Action
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to {pendingAction?.actionName} this
                booking?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (pendingAction) {
                      updateBookingStatus(
                        pendingAction.bookingId,
                        pendingAction.newStatus
                      );
                    }
                    setShowConfirmation(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Status Message */}
        {bookingStatus.show && (
          <div
            className={`w-full max-w-4xl mx-auto mb-6 p-4 rounded-lg border ${
              bookingStatus.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
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

        {/* Rest of your existing code remains the same */}
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
                      Tour with {booking.touristId?.name || "Tourist"}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at{" "}
                      {booking.startTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: {booking._id.slice(-8)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
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
                    <span className="text-gray-500">Earnings:</span>
                    <span className="ml-2 font-medium text-green-600">
                      ₹{booking.price}
                    </span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-4">
                    <span className="text-gray-500">Special Requests:</span>
                    <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Requested on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              booking._id,
                              "confirmed",
                              "accept"
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              booking._id,
                              "cancelled",
                              "decline"
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          ❌ Decline
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            booking._id,
                            "completed",
                            "mark as complete"
                          )
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        ✅ Mark Complete
                      </button>
                    )}
                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking._id, "cancelled", "cancel")
                        }
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        ✕ Cancel
                      </button>
                    )}

                    {/* Message button - you can implement this later */}
                    <button
                      onClick={() => {
                        showBookingStatus(
                          "Messaging feature coming soon!",
                          "info"
                        );
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm border border-indigo-200 px-3 py-2 rounded hover:bg-indigo-50 transition-colors"
                    >
                      💬 Message
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-500 text-lg mb-2">
                No booking requests found
              </p>
              <p className="text-gray-400 text-sm">
                {filter !== "all"
                  ? `No ${filter} bookings`
                  : "You don't have any booking requests yet"}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-indigo-600 hover:text-indigo-800 mt-4 font-medium"
                >
                  View all bookings
                </button>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
        {bookings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {bookings.length}
              </div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                ₹
                {bookings
                  .filter((b) => b.status === "completed")
                  .reduce((sum, b) => sum + (b.price || 0), 0)}
              </div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
