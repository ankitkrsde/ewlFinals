"use client";

import { useState } from "react";
import { IoIosStar } from "react-icons/io";

export default function ReviewForm({
  bookingId,
  guideId,
  guideName,
  onReviewSubmitted,
  onCancel,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showAlert = (message, type = "error") => {
    setNotification({ message, type });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showAlert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      showAlert("Please write a review comment");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guideId,
          bookingId,
          rating: {
            overall: rating,
            knowledge: rating,
            communication: rating,
            professionalism: rating,
          },
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("✅ Review submitted successfully!", "success");
        if (onReviewSubmitted) onReviewSubmitted(data.data);
      } else {
        showAlert(
          "❌ Failed to submit review: " + (data.message || "Please try again")
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showAlert("❌ Error submitting review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          } shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white text-sm font-bold`}
            >
              {notification.type === "success" ? "✓" : "!"}
            </div>
            <div>
              <p className="font-semibold">
                {notification.type === "success" ? "Success!" : "Error"}
              </p>
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Review Your Experience
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <p className="text-gray-600 mb-4">
        How was your tour with{" "}
        <span className="font-semibold">{guideName}</span>?
      </p>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none transition-transform hover:scale-110"
              >
                <IoIosStar
                  className={
                    star <= (hoverRating || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating > 0
              ? `Selected: ${rating} star${rating > 1 ? "s" : ""}`
              : "Click to rate"}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience with this guide. What did you enjoy? Any highlights?"
            minLength="10"
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 0 || !comment.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
