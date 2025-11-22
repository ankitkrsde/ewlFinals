"use client";

import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";

export default function ReviewButton({ booking }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfReviewed();
  }, [booking._id]);

  const checkIfReviewed = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reviews/booking/${booking._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setHasReviewed(data.success && data.data !== null);
    } catch (error) {
      console.error("Error checking review:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleReviewSubmitted = (reviewData) => {
    setShowReviewForm(false);
    setHasReviewed(true);
    // You can trigger a refresh of parent component if needed
    window.dispatchEvent(new Event("reviewSubmitted"));
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  // Show review button only if booking is completed and not reviewed
  const canReview = booking.status === "completed" && !hasReviewed && !checking;

  if (checking) {
    return (
      <div className="text-gray-500 text-sm">Checking review status...</div>
    );
  }

  return (
    <div className="mt-4">
      {canReview && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            How was your experience with {booking.guideId?.name}?
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors w-fit flex items-center gap-2"
          >
            <span>✍️</span>
            Write a Review
          </button>
        </div>
      )}

      {hasReviewed && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-green-700 font-medium flex items-center gap-2">
            <span>✅</span>
            You've reviewed this booking
          </p>
          <p className="text-green-600 text-sm mt-1">
            Thank you for your feedback!
          </p>
        </div>
      )}

      {booking.status !== "completed" && (
        <p className="text-gray-500 text-sm">
          You can review this booking after it's completed.
        </p>
      )}

      {showReviewForm && (
        <div className="mt-6">
          <ReviewForm
            bookingId={booking._id}
            guideId={booking.guideId?._id || booking.guideId}
            guideName={booking.guideId?.name || "the guide"}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={handleCancelReview}
          />
        </div>
      )}
    </div>
  );
}
