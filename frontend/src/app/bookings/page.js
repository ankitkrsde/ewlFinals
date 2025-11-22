"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "../components/reviews/ReviewForm";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviews, setReviews] = useState({});
  const [bookingStatus, setBookingStatus] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchBookings(token);
    fetchUserReviews(token);
  }, [router]);

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

  const fetchUserReviews = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/reviews/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        const reviewsMap = {};
        data.data.forEach((review) => {
          reviewsMap[review.bookingId] = true;
        });
        setReviews(reviewsMap);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Notification function
  const showBookingStatus = (message, type = "success") => {
    setBookingStatus({ show: true, message, type });

    setTimeout(() => {
      setBookingStatus({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleAddReview = (booking) => {
    setShowReviewForm(booking);
  };

  const handleReviewSubmitted = (reviewData) => {
    if (reviewData) {
      setReviews((prev) => ({
        ...prev,
        [reviewData.bookingId]: true,
      }));

      // Refresh to show updated status
      const token = localStorage.getItem("token");
      fetchBookings(token);
      fetchUserReviews(token);

      // REPLACED ALERT WITH NOTIFICATION
      showBookingStatus(
        "Thank you for your review! Your feedback helps other travelers.",
        "success"
      );
    }
    setShowReviewForm(null);
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

  // Modern cancellation function
  const handleCancelBooking = async (bookingId) => {
    setPendingAction({ type: "cancel", bookingId });
    setShowConfirmation(true);
  };

  // Execute cancellation after confirmation
  const executeCancellation = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showBookingStatus("Booking cancelled successfully", "success");
        fetchBookings(token);
      } else {
        showBookingStatus(data.message || "Failed to cancel booking", "error");
      }
    } catch (error) {
      showBookingStatus("Error cancelling booking", "error");
    }
  };

  // Check if booking can be reviewed
  const canAddReview = (booking) => {
    return booking.status === "completed" && !reviews[booking._id];
  };

  // Get completed bookings that haven't been reviewed
  const getPendingReviewsCount = () => {
    return bookings.filter((booking) => canAddReview(booking)).length;
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

        {/* Modern Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Booking
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (pendingAction?.type === "cancel") {
                      executeCancellation(pendingAction.bookingId);
                    }
                    setShowConfirmation(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Cancel Booking
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <ReviewForm
                  bookingId={showReviewForm._id}
                  guideId={
                    showReviewForm.guideId?._id || showReviewForm.guideId
                  }
                  guideName={showReviewForm.guideId?.name || "the guide"}
                  onReviewSubmitted={handleReviewSubmitted}
                  onCancel={() => setShowReviewForm(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pending Reviews Banner */}
        {getPendingReviewsCount() > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-lg">⭐</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  You have {getPendingReviewsCount()} completed tour
                  {getPendingReviewsCount() > 1 ? "s" : ""} to review
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Share your experience to help other travelers and support your
                  guide
                </p>
              </div>
            </div>
          </div>
        )}

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
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tour with {booking.guideId?.name || "Guide"}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at{" "}
                      {booking.startTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: {booking._id.slice(-8)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                    {booking.status === "completed" && reviews[booking._id] && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Reviewed ✓
                      </span>
                    )}
                  </div>
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
                    <p className="mt-1 text-gray-700">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Review Eligibility Notice */}
                {canAddReview(booking) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>✨ Tour Completed!</strong> Share your experience
                      with {booking.guideId?.name} to help other travelers.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        if (booking.guideId?._id) {
                          router.push(`/guides/${booking.guideId._id}`);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                    >
                      View Guide
                    </button>

                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    )}

                    {canAddReview(booking) && (
                      <button
                        onClick={() => handleAddReview(booking)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                      >
                        ⭐ Add Review
                      </button>
                    )}

                    {booking.status === "completed" && reviews[booking._id] && (
                      <span className="text-green-600 text-sm font-medium px-3 py-1 border border-green-200 rounded-lg bg-green-50">
                        Review Submitted ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Guide Button */}
                {booking.status !== "cancelled" && booking.guideId?._id && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() =>
                        router.push(`/messages/${booking.guideId._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                    >
                      <span>💬</span>
                      Message {booking.guideId?.name}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-500 text-lg mb-2">No bookings found</p>
              <p className="text-gray-400 text-sm mb-4">
                {filter !== "all"
                  ? `No ${filter} bookings`
                  : "Start by booking a guide"}
              </p>
              {filter !== "all" ? (
                <button
                  onClick={() => setFilter("all")}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all bookings
                </button>
              ) : (
                <button
                  onClick={() => router.push("/guides/search")}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Find Guides
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
                {getPendingReviewsCount()}
              </div>
              <div className="text-gray-600">Reviews Pending</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
