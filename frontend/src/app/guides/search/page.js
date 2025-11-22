"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import Image from "next/image";
import AvailabilityBadge from "@/app/components/guides/AvailabilityBadge";
import { useAuth } from "@/app/components/AuthProvider";

export default function GuideSearchPage() {
  const [guides, setGuides] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    language: "",
    minPrice: "",
    maxPrice: "",
    specialty: "",
    rating: "",
    experience: "",
    availability: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const { user } = useAuth();

  const fetchGuides = useCallback(async (searchFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...searchFilters,
        sort: sortBy === "rating" ? "-rating.average" : "hourlyRate",
      }).toString();

      console.log(
        "Fetching from:",
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/guides?${queryParams}`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/guides?${queryParams}`
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (data.success) {
        setGuides(data.data || []);
        console.log("Guides set:", data.data?.length || 0, "guides");
      } else {
        setError("Failed to fetch guides");
        console.error("API Error:", data.message);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  // FIXED: Use useMemo for debounced function with explicit dependencies
  const debouncedSearch = useMemo(() => 
    debounce((searchFilters) => {
      fetchGuides(searchFilters);
    }, 500),
  [fetchGuides]);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    );

    debouncedSearch(cleanFilters);
  }, [filters, debouncedSearch]);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    fetchGuides(cleanFilters);
  }, [filters, fetchGuides]);

  const clearFilters = useCallback(() => {
    setFilters({
      city: "",
      language: "",
      minPrice: "",
      maxPrice: "",
      specialty: "",
      rating: "",
      experience: "",
      availability: "",
    });
    fetchGuides();
  }, [fetchGuides]);

  useEffect(() => {
    console.log("Component mounted, fetching guides...");
    fetchGuides();
  }, [fetchGuides]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Local Guides
        </h1>
        <p className="text-gray-600 mb-8">
          Discover experienced local guides across India
        </p>

        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
              >
                <option value="">All Languages</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (₹/hr)
              </label>
              <input
                type="number"
                placeholder="Min"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (₹/hr)
              </label>
              <input
                type="number"
                placeholder="Max"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.specialty}
                onChange={(e) =>
                  handleFilterChange("specialty", e.target.value)
                }
              >
                <option value="">All Specialties</option>
                <option value="Historical">Historical</option>
                <option value="Cultural">Cultural</option>
                <option value="Food">Food</option>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Photography">Photography</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Rating
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.experience}
                onChange={(e) =>
                  handleFilterChange("experience", e.target.value)
                }
              >
                <option value="">Any Experience</option>
                <option value="5">5+ years</option>
                <option value="3">3+ years</option>
                <option value="1">1+ years</option>
                <option value="0">New Guides</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
            <span className="text-sm text-gray-500">
              {guides.length} guides found
            </span>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2">Loading guides...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.length > 0 ? (
              guides.map((guide) => (
                <GuideCard key={guide._id} guide={guide} currentUser={user} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 text-lg mb-2">
                  No guides found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Try clearing filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Guide Card Component
function GuideCard({ guide, currentUser }) {
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return "/images/default-avatar.jpg";
    if (avatarPath.startsWith("http")) return avatarPath;
    if (avatarPath.startsWith("/uploads/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${avatarPath}`;
    }
    return "/images/default-avatar.jpg";
  };

  // Button logic based on user role
  const renderButton = () => {
    if (!currentUser) {
      // Not logged in - show "View Profile"
      return (
        <Link
          href={`/guides/${guide.userId?._id}`}
          className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          View Profile
        </Link>
      );
    }

    // Check if current user is viewing their own guide profile
    const isOwnProfile = currentUser.id === guide.userId?._id;

    if (isOwnProfile) {
      // Guide viewing own profile - show "My Profile" (links to their own profile page)
      return (
        <Link
          href={`/guides/${guide.userId?._id}`}
          className="block w-full bg-gray-600 text-white text-center py-3 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          My Profile
        </Link>
      );
    }

    if (currentUser.role === "guide") {
      // Guide viewing another guide - show "View Profile" (links to public profile)
      return (
        <Link
          href={`/guides/${guide.userId?._id}`}
          className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          View Profile
        </Link>
      );
    }

    // Tourist viewing guide - show "View Profile & Book"
    return (
      <Link
        href={`/guides/${guide.userId?._id}`}
        className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        View Profile & Book
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div className="w-full h-48 relative rounded-t-lg overflow-hidden">
          <Image
            src={getAvatarUrl(guide.userId?.avatar)}
            alt={guide.userId?.name || "Guide profile picture"}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.src = "/images/default-avatar.jpg";
            }}
          />
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-yellow-600 font-semibold text-sm flex items-center">
            ⭐ {guide.rating?.average?.toFixed(1) || "New"}
            <span className="text-gray-500 text-xs ml-1">
              ({guide.rating?.count || 0})
            </span>
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <AvailabilityBadge guideId={guide._id} />
        </div>

        {/* Availability Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              guide.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {guide.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {guide.userId?.name}
          </h3>
        </div>

        <p className="text-gray-600 mb-3 flex items-center">
          📍 {guide.cities?.join(", ") || "Multiple cities"}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Languages:</span>
            <span className="flex-1 line-clamp-1">
              {guide.languages?.join(", ") || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Specialties:</span>
            <span className="flex-1 line-clamp-1">
              {guide.specialties?.join(", ") || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Experience:</span>
            <span>{guide.experience || 0} years</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{guide.hourlyRate || 0}
            </span>
            <span className="text-gray-500 text-sm">/hour</span>
          </div>
          {guide.experience >= 5 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Expert
            </span>
          )}
        </div>

        {/* Use the conditional button */}
        {renderButton()}
      </div>
    </div>
  );
}