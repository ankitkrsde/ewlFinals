"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch user stats based on role
      let statsResponse, bookingsResponse;

      if (user.role === "tourist") {
        statsResponse = await fetch(
          "http://localhost:5000/api/bookings?limit=5",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (user.role === "guide") {
        statsResponse = await fetch("http://localhost:5000/api/guides/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        bookingsResponse = await fetch(
          "http://localhost:5000/api/bookings?limit=5",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (statsResponse) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || {});
      }

      if (bookingsResponse) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Role-based dashboard */}
        {user.role === "tourist" && (
          <TouristDashboard
            user={user}
            stats={stats}
            recentBookings={recentBookings}
          />
        )}
        {user.role === "guide" && (
          <GuideDashboard
            user={user}
            stats={stats}
            recentBookings={recentBookings}
          />
        )}
        {user.role === "admin" && <AdminDashboard user={user} stats={stats} />}
      </main>
    </div>
  );
}

// ... Rest of the dashboard component code remains the same as previous implementation
// [Include the TouristDashboard, GuideDashboard, and AdminDashboard components from previous code]
