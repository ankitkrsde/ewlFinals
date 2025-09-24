"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    setUser(userData);
    fetchUserStats(userData);
  }, []);

  const fetchUserStats = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";

      if (userData.role === "tourist") {
        endpoint = "/api/bookings?status=upcoming";
      } else if (userData.role === "guide") {
        endpoint = "/api/guides/me/bookings";
      }

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user.name}!
        </h1>

        {/* Role-based dashboard */}
        {user.role === "tourist" && <TouristDashboard stats={stats} />}
        {user.role === "guide" && <GuideDashboard stats={stats} />}
        {user.role === "admin" && <AdminDashboard stats={stats} />}
      </div>
    </div>
  );
}

function TouristDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Upcoming Tours</h3>
        <p className="text-3xl font-bold text-indigo-600">
          {stats.upcoming || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Completed Tours</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.completed || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <p className="text-3xl font-bold text-blue-600">
          {stats.messages || 0}
        </p>
      </div>

      <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/guides/search"
          className="bg-indigo-600 text-white p-6 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Find Local Guides</h3>
          <p>Discover verified guides in your destination</p>
        </Link>

        <Link
          href="/bookings"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
          <p>Manage your tour bookings</p>
        </Link>
      </div>
    </div>
  );
}

function GuideDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pending Bookings</h3>
        <p className="text-3xl font-bold text-yellow-600">
          {stats.pending || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Confirmed Tours</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.confirmed || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
        <p className="text-3xl font-bold text-blue-600">
          ₹{stats.earnings || 0}
        </p>
      </div>

      <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/guide/profile"
          className="bg-indigo-600 text-white p-6 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">My Profile</h3>
          <p>Update your guide information</p>
        </Link>

        <Link
          href="/guide/availability"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Availability</h3>
          <p>Set your working hours</p>
        </Link>

        <Link
          href="/guide/bookings"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2">Bookings</h3>
          <p>Manage tour requests</p>
        </Link>
      </div>
    </div>
  );
}
