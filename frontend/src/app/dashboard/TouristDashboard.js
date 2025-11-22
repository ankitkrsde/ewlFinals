"use client";
import Link from "next/link";

export default function TouristDashboard({ user, stats, recentBookings }) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to explore new destinations with local guides?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalBookings || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Completed Tours
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.completedTours || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
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
              <p className="text-sm font-medium text-gray-600">
                Upcoming Tours
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.upcomingTours || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/guides/search"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-blue-600 font-semibold">Find Guides</div>
            <p className="text-sm text-gray-600 mt-1">Book local guides</p>
          </Link>

          <Link
            href="/bookings"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-green-600 font-semibold">My Bookings</div>
            <p className="text-sm text-gray-600 mt-1">View all bookings</p>
          </Link>

          {/* <Link
            href="/reviews"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-purple-600 font-semibold">Write Reviews</div>
            <p className="text-sm text-gray-600 mt-1">Share experiences</p>
          </Link> */}

          <Link
            href="/profile"
            className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-orange-600 font-semibold">Profile</div>
            <p className="text-sm text-gray-600 mt-1">Update details</p>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>
          <Link
            href="/bookings"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentBookings && recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {booking.guide?.name || "Local Guide"}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} • {booking.time}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{booking.price}</p>
                <p className="text-sm text-gray-600">
                  {booking.duration} hours
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-2 text-gray-600">No bookings yet</p>
            <Link
              href="/guides/search"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Find your first guide →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
