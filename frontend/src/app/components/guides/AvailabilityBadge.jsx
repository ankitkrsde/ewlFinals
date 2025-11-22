"use client";
import { useState, useEffect } from "react";

export default function AvailabilityBadge({ guideId, showText = false }) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, [guideId]);

  const checkAvailability = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost:5000/api/guides/${guideId}/availability?date=${today}`
      );
      const data = await response.json();

      if (data.success) {
        setAvailability(data.data);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        Checking...
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  const isAvailable = availability.isAvailable;

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-1 ${
          isAvailable ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      {showText
        ? isAvailable
          ? "Available Today"
          : "Unavailable Today"
        : isAvailable
          ? "Available"
          : "Unavailable"}
    </div>
  );
}
