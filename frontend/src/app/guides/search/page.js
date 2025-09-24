"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuideSearch() {
  const [guides, setGuides] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    language: "",
    minPrice: "",
    maxPrice: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchFilters).toString();
      const response = await fetch(`/api/guides?${queryParams}`);
      const data = await response.json();
      setGuides(data.data || []);
    } catch (error) {
      console.error("Error fetching guides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchGuides(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Find Local Guides
        </h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="">Select Language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              {/* Add more languages */}
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
          </div>
        </div>

        {/* Guides List */}
        {loading ? (
          <div className="text-center">Loading guides...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide._id} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuideCard({ guide }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <img
        src={guide.userId?.avatar || "/default-avatar.jpg"}
        alt={guide.userId?.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{guide.userId?.name}</h3>
        <p className="text-gray-600 mb-2">{guide.cities?.join(", ")}</p>
        <p className="text-gray-600 mb-2">
          Languages: {guide.languages?.join(", ")}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{guide.hourlyRate}/hour
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500">
              ⭐ {guide.rating?.average || "New"}
            </span>
          </div>
        </div>
        <Link
          href={`/guides/${guide._id}`}
          className="block w-full bg-indigo-600 text-white text-center py-2 rounded hover:bg-indigo-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
