"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import TouristDashboard from "./TouristDashboard";
import GuideDashboard from "./GuideDashboard";
import AdminDashboard from "./AdminDashboard";

// Mock data function (NOT a hook)
const getMockData = (userRole) => {
  const mockData = {
    tourist: {
      stats: {
        totalBookings: 3,
        completedTours: 1,
        upcomingTours: 2,
        totalSpent: 7500,
      },
      recentBookings: [
        {
          _id: "1",
          guide: { name: "Local Guide Mike" },
          date: "2024-01-15",
          time: "10:00 AM",
          status: "confirmed",
          price: 2500,
          duration: 3,
        },
        {
          _id: "2",
          guide: { name: "City Explorer Sarah" },
          date: "2024-01-20",
          time: "2:00 PM",
          status: "pending",
          price: 3000,
          duration: 4,
        },
      ],
    },
    guide: {
      stats: {
        totalBookings: 8,
        pendingBookings: 2,
        confirmedBookings: 6,
        totalEarnings: 15600,
        averageRating: 4.7,
      },
      recentBookings: [
        {
          _id: "1",
          tourist: { name: "Sarah Wilson" },
          date: "2024-01-15",
          time: "10:00 AM",
          status: "pending",
          price: 2800,
          duration: 4,
        },
        {
          _id: "2",
          tourist: { name: "John Doe" },
          date: "2024-01-12",
          time: "9:00 AM",
          status: "confirmed",
          price: 3200,
          duration: 5,
        },
      ],
    },
    admin: {
      stats: {
        totalUsers: 156,
        totalGuides: 42,
        totalBookings: 89,
        totalRevenue: 225000,
      },
      recentBookings: [],
    },
  };
  return mockData[userRole] || mockData.tourist;
};

function DashboardContent() {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Helper function to calculate tourist stats from bookings
  const calculateTouristStats = useCallback((bookings) => {
    const totalBookings = bookings.length;
    const completedTours = bookings.filter(
      (b) => b.status === "completed" || b.status === "confirmed"
    ).length;
    const upcomingTours = bookings.filter(
      (b) => b.status === "pending" || b.status === "upcoming"
    ).length;
    const totalSpent = bookings
      .filter((b) => b.status === "completed" || b.status === "confirmed")
      .reduce((sum, booking) => sum + (booking.price || 0), 0);

    return {
      totalBookings,
      completedTours,
      upcomingTours,
      totalSpent,
    };
  }, []);

  // Helper function to calculate guide stats
  const calculateGuideStats = useCallback((guideData, bookings) => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const totalEarnings = bookings
      .filter((b) => b.status === "completed" || b.status === "confirmed")
      .reduce((sum, booking) => sum + (booking.price || 0), 0);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalEarnings,
      averageRating:
        guideData.data?.averageRating || guideData.averageRating || 4.5,
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log("Dashboard: Fetching dashboard data for", user?.role);
      const token = localStorage.getItem("token");

      if (user?.role === "tourist") {
        // For tourist - get their bookings using the correct endpoint
        try {
          const bookingsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            console.log(
              "Dashboard: Tourist bookings data received",
              bookingsData
            );

            // Calculate stats from bookings
            const bookings = bookingsData.data || bookingsData || [];
            const calculatedStats = calculateTouristStats(bookings);
            setStats(calculatedStats);
            setRecentBookings(bookings.slice(0, 5)); // Show last 5 bookings
          } else {
            console.log(
              "Tourist bookings endpoint returned error, using mock data"
            );
            const mockData = getMockData("tourist");
            setStats(mockData.stats);
            setRecentBookings(mockData.recentBookings);
          }
        } catch (error) {
          console.log("Tourist bookings API error, using mock data");
          const mockData = getMockData("tourist");
          setStats(mockData.stats);
          setRecentBookings(mockData.recentBookings);
        }
      } else if (user?.role === "guide") {
        // For guide - get guide profile and bookings using correct endpoints
        try {
          const [guideResponse, bookingsResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/guides/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          ]);

          let guideData = {};
          let bookingsData = [];

          if (guideResponse.ok) {
            guideData = await guideResponse.json();
            console.log("Dashboard: Guide data received", guideData);
          } else {
            console.log("Guide profile endpoint returned error");
          }

          if (bookingsResponse.ok) {
            const bookingsResult = await bookingsResponse.json();
            bookingsData = bookingsResult.data || bookingsResult || [];
            console.log(
              "Dashboard: Guide bookings data received",
              bookingsData
            );
          } else {
            console.log("Bookings endpoint returned error");
          }

          // Calculate stats from guide data and bookings
          const calculatedStats = calculateGuideStats(guideData, bookingsData);
          setStats(calculatedStats);
          setRecentBookings(bookingsData.slice(0, 5)); // Show last 5 bookings
        } catch (error) {
          console.log("Guide APIs error, using mock data");
          const mockData = getMockData("guide");
          setStats(mockData.stats);
          setRecentBookings(mockData.recentBookings);
        }
      } else if (user?.role === "admin") {
        // For admin - get platform stats using correct endpoint
        try {
          const statsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log("Dashboard: Admin stats received", statsData);
            setStats(statsData.data || statsData || {});
          } else {
            console.log(
              "Admin dashboard endpoint returned error, using mock data"
            );
            const mockData = getMockData("admin");
            setStats(mockData.stats);
          }
        } catch (error) {
          console.log("Admin stats API error, using mock data");
          const mockData = getMockData("admin");
          setStats(mockData.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data
      const mockData = getMockData(user?.role);
      setStats(mockData.stats);
      setRecentBookings(mockData.recentBookings);
    } finally {
      setDataLoading(false);
    }
  }, [user, calculateTouristStats, calculateGuideStats]);

  useEffect(() => {
    console.log("Dashboard: User changed", {
      user: user?.name,
      role: user?.role,
      hasToken: !!localStorage.getItem("token"),
    });

    // If we have a user, fetch dashboard data
    if (user) {
      console.log("Dashboard: User found, fetching data");
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Show data loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  console.log("Dashboard: Rendering dashboard for", user?.role);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.name}!
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.role === "tourist" && "Tourist"}
                {user?.role === "guide" && "Local Guide"}
                {user?.role === "admin" && "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {user?.role === "tourist" && (
          <TouristDashboard
            user={user}
            stats={stats}
            recentBookings={recentBookings}
          />
        )}
        {user?.role === "guide" && (
          <GuideDashboard
            user={user}
            stats={stats}
            recentBookings={recentBookings}
          />
        )}
        {user?.role === "admin" && <AdminDashboard user={user} stats={stats} />}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}