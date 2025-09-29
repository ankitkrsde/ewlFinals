"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuideSearchPage() {
  const [guides, setGuides] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    language: "",
    minPrice: "",
    maxPrice: "",
    specialty: "",
    rating: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchFilters).toString();
      const response = await fetch(
        `http://localhost:5000/api/guides?${queryParams}`
      );
      const data = await response.json();

      if (data.success) {
        setGuides(data.data || []);
      } else {
        setError("Failed to fetch guides");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    );

    fetchGuides(cleanFilters);
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      language: "",
      minPrice: "",
      maxPrice: "",
      specialty: "",
      rating: "",
    });
    fetchGuides();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Local Guides
        </h1>
        <p className="text-gray-600 mb-8">
          Discover experienced local guides across India
        </p>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <input
              type="text"
              placeholder="City"
              className="border rounded px-3 py-2"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              className="border rounded px-3 py-2"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="border rounded px-3 py-2"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={filters.specialty}
              onChange={(e) => handleFilterChange("specialty", e.target.value)}
            >
              <option value="">All Specialties</option>
              <option value="Historical">Historical</option>
              <option value="Cultural">Cultural</option>
              <option value="Food">Food</option>
              <option value="Adventure">Adventure</option>
              <option value="Nature">Nature</option>
            </select>
            <select
              className="border rounded px-3 py-2"
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
          <button
            onClick={clearFilters}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Clear all filters
          </button>
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
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">{guides.length} guides found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.length > 0 ? (
                guides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">
                    No guides found matching your criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-indigo-600 hover:text-indigo-800 mt-2"
                  >
                    Try clearing filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GuideCard({ guide }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300">
      <div className="relative">
        <img
          src={guide.userId?.avatar || "/default-avatar.jpg"}
          alt={guide.userId?.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 shadow">
          <span className="text-yellow-500 font-semibold">
            ⭐ {guide.rating?.average || "New"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {guide.userId?.name}
        </h3>
        <p className="text-gray-600 mb-3">{guide.cities?.join(", ")}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Languages:</span>
            <span className="ml-2">{guide.languages?.join(", ")}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Specialties:</span>
            <span className="ml-2">{guide.specialties?.join(", ")}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Experience:</span>
            <span className="ml-2">{guide.experience || 0} years</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{guide.hourlyRate}/hour
          </span>
          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
            {guide.verificationStatus === "approved" ? "Verified" : "Pending"}
          </span>
        </div>

        <Link
          href={`/guides/${guide._id}`}
          className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}
