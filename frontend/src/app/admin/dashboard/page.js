"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminRoute from "../../components/AdminRoute"; // Add this import

// Move all your existing content to this inner component
function AdminDashboardContent() {
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // REMOVE THIS MANUAL CHECK - AdminRoute handles it
    // if (!token || user?.role !== "admin") {
    //   router.push("/auth/login");
    //   return;
    // }

    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const [statsResponse, verificationsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          "http://localhost:5000/api/admin/verifications?status=pending&limit=5",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const statsData = await statsResponse.json();
      const verificationsData = await verificationsResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
      if (verificationsData.success) {
        setPendingVerifications(verificationsData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (guideId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/verifications/${guideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPendingVerifications(
          pendingVerifications.filter((g) => g._id !== guideId)
        );
        alert(`Guide ${status} successfully`);
      }
    } catch (error) {
      alert("Error processing verification");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="text-2xl">🧭</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Verified Guides
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalGuides || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Verifications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingVerifications || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.totalRevenue || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Verifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">
                Pending Guide Verifications
              </h2>
            </div>
            <div className="p-6">
              {pendingVerifications.length > 0 ? (
                <div className="space-y-4">
                  {pendingVerifications.map((guide) => (
                    <div
                      key={guide._id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <h4 className="font-medium">{guide.userId?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {guide.cities?.join(", ")}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            handleVerification(guide._id, "approved")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(guide._id, "rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No pending verifications
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
                >
                  Manage Users
                </button>
                <button
                  onClick={() => router.push("/admin/guides")}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                >
                  View All Guides
                </button>
                <button
                  onClick={() => router.push("/admin/reports")}
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                  Generate Reports
                </button>
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
                >
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>New user registration</span>
                <span className="text-sm text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Booking completed</span>
                <span className="text-sm text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Guide verification approved</span>
                <span className="text-sm text-gray-500">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the main component with AdminRoute
export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
