"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";

function EarningsContent() {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    completedEarnings: 0,
    monthlyEarnings: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  useEffect(() => {
    if (user?.role === "guide") {
      fetchEarningsData();
    }
  }, [user, selectedPeriod]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      // For now, using mock data - you'll need to create backend API for this
      const mockEarningsData = {
        totalEarnings: 15600,
        pendingEarnings: 3200,
        completedEarnings: 12400,
        monthlyEarnings: [
          { month: "Jan 2024", earnings: 4200, bookings: 3 },
          { month: "Feb 2024", earnings: 3800, bookings: 2 },
          { month: "Mar 2024", earnings: 4400, bookings: 4 },
          { month: "Apr 2024", earnings: 3200, bookings: 2 },
        ],
        recentTransactions: [
          {
            id: 1,
            touristName: "Sarah Wilson",
            date: "2024-04-15",
            amount: 2800,
            status: "completed",
            service: "Heritage Walk",
          },
          {
            id: 2,
            touristName: "John Doe",
            date: "2024-04-12",
            amount: 3200,
            status: "completed",
            service: "Food Tour",
          },
          {
            id: 3,
            touristName: "Mike Johnson",
            date: "2024-04-10",
            amount: 2400,
            status: "pending",
            service: "City Tour",
          },
          {
            id: 4,
            touristName: "Emma Davis",
            date: "2024-04-08",
            amount: 3000,
            status: "completed",
            service: "Photography Tour",
          },
        ],
      };

      setEarningsData(mockEarningsData);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
              <p className="mt-2 text-gray-600">
                Track your earnings and financial performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{earningsData.totalEarnings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{earningsData.completedEarnings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{earningsData.pendingEarnings}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Earnings
            </h2>
            <div className="space-y-4">
              {earningsData.monthlyEarnings.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {month.month}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {month.bookings} bookings
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{month.earnings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {earningsData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.touristName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.service}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{transaction.amount}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Withdraw Earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Available for withdrawal
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{earningsData.completedEarnings}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pending earnings will be available after tour completion
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Withdraw Funds
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <ProtectedRoute>
      <EarningsContent />
    </ProtectedRoute>
  );
}
