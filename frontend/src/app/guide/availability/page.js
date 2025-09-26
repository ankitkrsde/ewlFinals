"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuideAvailabilityPage() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "guide") {
      router.push("/auth/login");
      return;
    }

    fetchAvailability(token);
  }, []);

  const fetchAvailability = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/guides/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setAvailability(data.data.availability || []);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeSlot = (day, time) => {
    setAvailability((prev) => {
      const dayIndex = prev.findIndex((a) => a.day === day);

      if (dayIndex === -1) {
        return [
          ...prev,
          { day, slots: [{ start: time, end: getNextHour(time) }] },
        ];
      }

      const dayAvailability = prev[dayIndex];
      const slotIndex = dayAvailability.slots.findIndex(
        (s) => s.start === time
      );

      if (slotIndex === -1) {
        // Add slot
        const newSlots = [
          ...dayAvailability.slots,
          { start: time, end: getNextHour(time) },
        ];
        const newAvailability = [...prev];
        newAvailability[dayIndex] = { ...dayAvailability, slots: newSlots };
        return newAvailability;
      } else {
        // Remove slot
        const newSlots = dayAvailability.slots.filter(
          (_, i) => i !== slotIndex
        );
        const newAvailability = [...prev];
        if (newSlots.length === 0) {
          // Remove day if no slots left
          return prev.filter((_, i) => i !== dayIndex);
        } else {
          newAvailability[dayIndex] = { ...dayAvailability, slots: newSlots };
          return newAvailability;
        }
      }
    });
  };

  const getNextHour = (time) => {
    const [hours] = time.split(":").map(Number);
    const nextHour = (hours + 1) % 24;
    return `${nextHour.toString().padStart(2, "0")}:00`;
  };

  const isSlotSelected = (day, time) => {
    const dayAvailability = availability.find((a) => a.day === day);
    if (!dayAvailability) return false;
    return dayAvailability.slots.some((slot) => slot.start === time);
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/guides/availability",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availability }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Availability updated successfully!");
      }
    } catch (error) {
      alert("Error updating availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Availability Schedule
        </h1>
        <p className="text-gray-600 mb-8">
          Set your available time slots for each day
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b">Time/Day</th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="text-center p-3 border-b font-medium"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="p-3 border-b text-sm">{time}</td>
                    {days.map((day) => (
                      <td key={day} className="p-3 border-b text-center">
                        <button
                          onClick={() => toggleTimeSlot(day, time)}
                          className={`w-8 h-8 rounded border ${
                            isSlotSelected(day, time)
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-white border-gray-300 hover:border-indigo-600"
                          }`}
                        >
                          {isSlotSelected(day, time) && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                <span className="inline-block w-3 h-3 bg-indigo-600 rounded mr-2"></span>
                Selected time slots indicate when you're available for tours
              </p>
            </div>
            <button
              onClick={saveAvailability}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              💡 Tips for Setting Availability
            </h3>
            <ul className="text-sm space-y-1">
              <li>• Be realistic about your available hours</li>
              <li>• Consider travel time between locations</li>
              <li>• Leave buffer time between tours</li>
              <li>• Update regularly based on your schedule</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              ✅ Current Availability Summary
            </h3>
            <div className="text-sm space-y-1">
              <p>
                Total available hours per week:{" "}
                {availability.reduce(
                  (total, day) => total + day.slots.length,
                  0
                )}
              </p>
              <p>Days available: {availability.length} out of 7</p>
              <p>Peak hours: 10:00 - 16:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
