"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthDebugger from "@/app/debug/AuthDebugger";

export default function GuideProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

    const fetchProfile = useCallback(async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/guides/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "guide") {
      router.push("/auth/login");
      return;
    }

    fetchProfile(token);
  }, [router, fetchProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/guides", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Profile updated successfully!");
        setProfile(data.data);
      }
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Guide Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full border rounded px-3 py-2"
                        value={formData.hourlyRate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hourlyRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={formData.experience || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border rounded px-3 py-2"
                    value={formData.bio || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell tourists about yourself and your guiding style..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cities
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={formData.cities?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cities: e.target.value.split(",").map((c) => c.trim()),
                      })
                    }
                    placeholder="Delhi, Mumbai, Goa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Historical",
                      "Cultural",
                      "Food",
                      "Adventure",
                      "Nature",
                      "Photography",
                    ].map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            formData.specialties?.includes(specialty) || false
                          }
                          onChange={(e) => {
                            const specialties = formData.specialties || [];
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                specialties: [...specialties, specialty],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                specialties: specialties.filter(
                                  (s) => s !== specialty
                                ),
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        {specialty}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Profile Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span
                    className={`font-medium ${
                      profile?.verificationStatus === "approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {profile?.verificationStatus || "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-medium">
                    ⭐ {profile?.rating?.average || "0.0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reviews:</span>
                  <span className="font-medium">
                    {profile?.rating?.count || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed Tours:</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Earnings:</span>
                  <span>₹{profile?.hourlyRate * 12 || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate:</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
