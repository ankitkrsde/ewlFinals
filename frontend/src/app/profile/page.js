"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { api } from "../utils/app";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import ProtectedRoute from "../components/ProtectedRoute";
import AvatarUpload from "../components/AvatarUpload";

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: {
      city: "",
      state: "",
      country: "India",
    },
    languages: [],
  });

  const [guideData, setGuideData] = useState({
    hourlyRate: 0,
    experience: 0,
    bio: "",
    specialties: [],
    services: [],
    availability: [],
    cities: [],
    languages: [],
    isAvailable: true,
    rating: { average: 0, count: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [guideProfileLoaded, setGuideProfileLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || {
          city: "",
          state: "",
          country: "India",
        },
        languages: user.languages || [],
      });

      // Load guide profile if user is a guide
      if (user.role === "guide") {
        loadGuideProfile();
      }
    }
  }, [user]);

  // Load guide data when guide tab becomes active
  useEffect(() => {
    if (
      activeTab === "guide" &&
      user?.role === "guide" &&
      !guideProfileLoaded
    ) {
      console.log("🔄 Guide tab activated, loading guide profile...");
      loadGuideProfile();
    }
  }, [activeTab, user, guideProfileLoaded]);

  const loadGuideProfile = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading guide profile for user:", user?.id);

      const data = await api.getGuideProfile();

      console.log("📦 Guide profile API response:", data);

      if (data.success) {
        if (data.data) {
          console.log("✅ Guide profile loaded:", data.data);
          setGuideData({
            hourlyRate: data.data.hourlyRate || 0,
            experience: data.data.experience || 0,
            bio: data.data.bio || "",
            specialties: data.data.specialties || [],
            services: data.data.services || [],
            availability: data.data.availability || [],
            cities: data.data.cities || [],
            languages: data.data.languages || [],
            isAvailable: data.data.isAvailable !== false,
            rating: data.data.rating || { average: 0, count: 0 },
          });
          setGuideProfileLoaded(true);
        } else {
          console.log(
            "ℹ️ No guide profile found - this guide needs to create their profile"
          );
          // Don't set empty state - let them fill the form from scratch
          // This prevents sending empty arrays that wipe out existing data
          setGuideProfileLoaded(false);
        }
      } else {
        console.log("❌ API returned success: false");
        setError(data.message || "Failed to load guide profile");
      }
    } catch (error) {
      console.error("❌ Error loading guide profile:", error);
      setError("Failed to load guide profile");
    } finally {
      setLoading(false);
    }
  };

  // Force reload guide profile data
  const reloadGuideProfile = async () => {
    setGuideProfileLoaded(false);
    await loadGuideProfile();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else if (name.startsWith("guide.")) {
      const guideField = name.split(".")[1];
      setGuideData((prev) => ({
        ...prev,
        [guideField]: type === "number" ? parseFloat(value) : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        languages: prev.languages.filter((lang) => lang !== value),
      }));
    }
  };

  const handleSpecialtyChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setGuideData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, value],
      }));
    } else {
      setGuideData((prev) => ({
        ...prev,
        specialties: prev.specialties.filter(
          (specialty) => specialty !== value
        ),
      }));
    }
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    if (value && !guideData.cities.includes(value)) {
      setGuideData((prev) => ({
        ...prev,
        cities: [...prev.cities, value],
      }));
      e.target.value = ""; // Clear input
    }
  };

  const removeCity = (cityToRemove) => {
    setGuideData((prev) => ({
      ...prev,
      cities: prev.cities.filter((city) => city !== cityToRemove),
    }));
  };

  // IMPROVED: Profile Completion Calculation
  const calculateProfileCompletion = () => {
    if (!user) return 0;

    let completedFields = 0;
    let totalFields = 0;

    // Basic profile fields for all users
    const basicFields = [
      { value: formData.name, weight: 1 },
      { value: formData.email, weight: 1 },
      { value: formData.phone, weight: 1 },
      { value: formData.bio, weight: 1 },
      { value: formData.location?.city, weight: 1 },
      { value: formData.languages?.length > 0, weight: 1 },
      {
        value: user?.avatar && !user.avatar.includes("default-avatar"),
        weight: 1,
      },
    ];

    totalFields = basicFields.length;
    completedFields = basicFields.filter((field) => {
      if (typeof field.value === "boolean") return field.value;
      if (Array.isArray(field.value)) return field.value.length > 0;
      return field.value && field.value.toString().trim().length > 0;
    }).length;

    // Guide-specific fields - only count if user is guide AND has guide data
    if (user?.role === "guide" && guideProfileLoaded) {
      const guideFields = [
        { value: guideData.hourlyRate > 0, weight: 1 },
        { value: guideData.experience > 0, weight: 1 },
        { value: guideData.bio && guideData.bio.trim().length > 0, weight: 1 },
        { value: guideData.specialties?.length > 0, weight: 1 },
        { value: guideData.cities?.length > 0, weight: 1 },
        { value: guideData.languages?.length > 0, weight: 1 },
        { value: guideData.services?.length > 0, weight: 1 },
        { value: guideData.availability?.length > 0, weight: 1 },
      ];

      totalFields += guideFields.length;
      completedFields += guideFields.filter((field) => field.value).length;
    }

    const completion =
      totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    console.log(
      `📊 Profile Completion: ${completedFields}/${totalFields} = ${completion}%`
    );
    return completion;
  };

  // IMPROVED: Guide Profile Completion Calculation
  const calculateGuideProfileCompletion = () => {
    if (!guideData || user?.role !== "guide" || !guideProfileLoaded) return 0;

    const guideFields = [
      { value: guideData.hourlyRate > 0, weight: 1 },
      { value: guideData.experience > 0, weight: 1 },
      { value: guideData.bio && guideData.bio.trim().length > 0, weight: 1 },
      { value: guideData.specialties?.length > 0, weight: 1 },
      { value: guideData.cities?.length > 0, weight: 1 },
      { value: guideData.languages?.length > 0, weight: 1 },
      { value: guideData.services?.length > 0, weight: 1 },
      { value: guideData.availability?.length > 0, weight: 1 },
    ];

    const completedFields = guideFields.filter((field) => field.value).length;
    const totalFields = guideFields.length;

    const completion = Math.round((completedFields / totalFields) * 100);
    console.log(
      `📊 Guide Profile Completion: ${completedFields}/${totalFields} = ${completion}%`,
      {
        hourlyRate: guideData.hourlyRate,
        experience: guideData.experience,
        specialties: guideData.specialties?.length,
        cities: guideData.cities?.length,
        languages: guideData.languages?.length,
        services: guideData.services?.length,
        availability: guideData.availability?.length,
      }
    );
    return completion;
  };

  // Separate handler for basic profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.updateProfile(formData);

      if (data.success) {
        setSuccess("Profile updated successfully!");

        // Update user in context
        if (updateUser) {
          updateUser(data.data);
        }

        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleGuideProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      console.log("=== DEBUG: START GUIDE PROFILE SUBMIT ===");
      console.log("Current guideData state:", guideData);

      // First, check if we have an existing profile
      console.log("🔍 Checking for existing profile...");
      const existingProfile = await api.getGuideProfile();
      console.log("Existing profile check:", existingProfile);

      const guideSaveData = {
        hourlyRate: guideData.hourlyRate,
        experience: guideData.experience,
        bio: guideData.bio,
        specialties: guideData.specialties,
        languages: guideData.languages,
        cities: guideData.cities,
        services: guideData.services,
        availability: guideData.availability,
        isAvailable: guideData.isAvailable,
      };

      console.log("📤 Data being sent to backend:", guideSaveData);

      let data;
      if (existingProfile.success && !existingProfile.data) {
        // No profile exists - CREATE a new one
        console.log("🆕 CALLING: api.createGuideProfile()");
        data = await api.createGuideProfile(guideSaveData);
      } else {
        // Profile exists - UPDATE it
        console.log("🔄 CALLING: api.updateGuideProfile()");
        data = await api.updateGuideProfile(guideSaveData);
      }

      console.log("✅ Backend response:", data);

      if (data.success) {
        setSuccess("Guide profile saved successfully!");
        console.log("🎉 Profile saved successfully, reloading...");
        await reloadGuideProfile();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to save guide profile");
      }
    } catch (error) {
      console.error("❌ Guide profile save error:", error);
      setError(error.message || "Failed to save guide profile");
    } finally {
      setSaving(false);
    }
  };

  // Render Stars function
  const renderStars = (rating) => {
    const actualRating = typeof rating === "number" ? rating : rating?.average;

    if (!actualRating || actualRating === 0) {
      return <span className="text-sm text-gray-500">No ratings yet</span>;
    }

    const stars = [];
    const fullStars = Math.floor(actualRating);
    const hasHalfStar = actualRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoIosStar key={i} size={16} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(
        <IoIosStarHalf key="half" size={16} className="text-yellow-500" />
      );
    }

    const remainingStars = 5 - Math.ceil(actualRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IoIosStar key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">
          ({actualRating.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleAvatarUpdate = (newAvatar) => {
    const updatedAvatar = `${newAvatar.split("?")[0]}?t=${Date.now()}`;

    if (updateUser) {
      updateUser({
        ...user,
        avatar: updatedAvatar,
      });
    }

    setSuccess("Avatar updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return "/images/default-avatar.jpg";
    if (avatarPath.startsWith("http")) return avatarPath;
    if (avatarPath.startsWith("/uploads/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${avatarPath}`;
    }
    return "/images/default-avatar.jpg";
  };

  const profileCompletion = calculateProfileCompletion();

  // Available specialties for guides
  const availableSpecialties = [
    "Historical",
    "Cultural",
    "Food",
    "Adventure",
    "Spiritual",
    "Nature",
    "Photography",
    "Shopping",
    "Architecture",
    "Wildlife",
  ];

  // Service management
  const addService = () => {
    setGuideData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", description: "", duration: "", price: "" },
      ],
    }));
  };

  const removeService = (index) => {
    setGuideData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setGuideData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  // Availability management
  const toggleDayAvailability = (day, isAvailable) => {
    setGuideData((prev) => {
      if (isAvailable) {
        return {
          ...prev,
          availability: [
            ...prev.availability,
            { day, slots: [{ start: "09:00", end: "17:00" }] },
          ],
        };
      } else {
        return {
          ...prev,
          availability: prev.availability.filter((avail) => avail.day !== day),
        };
      }
    });
  };

  const updateTimeSlot = (day, type, value) => {
    setGuideData((prev) => ({
      ...prev,
      availability: prev.availability.map((avail) =>
        avail.day === day
          ? {
              ...avail,
              slots: [{ ...avail.slots[0], [type]: value }],
            }
          : avail
      ),
    }));
  };

  const getDaySlots = (day) => {
    const dayAvailability = guideData.availability.find(
      (avail) => avail.day === day
    );
    return dayAvailability?.slots?.[0] || { start: "", end: "" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Completion */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Profile Completion
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {profileCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Complete your profile to get the most out of Explore With Locals
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile Information
            </button>
            {user?.role === "guide" && (
              <button
                onClick={() => setActiveTab("guide")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "guide"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Guide Profile
              </button>
            )}
            <button
              onClick={() => setActiveTab("security")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "security"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Profile Tab - Common for all users */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Picture
                </h3>
                <AvatarUpload
                  currentAvatar={getAvatarUrl(user?.avatar)}
                  onAvatarUpdate={handleAvatarUpdate}
                  userId={user?.id}
                  size="xl"
                />
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleProfileSubmit}
                className="bg-white shadow rounded-lg"
              >
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="location.city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="location.city"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label
                        htmlFor="location.state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="location.state"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label
                        htmlFor="location.country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <select
                        id="location.country"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-3 bg-gray-50 text-right rounded-b-lg">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Guide Profile Tab - Only for guides */}
        {activeTab === "guide" && user?.role === "guide" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2">Loading guide profile...</p>
              </div>
            ) : (
              <>
                {/* Guide Profile Form */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Guide Profile Settings
                    </h3>

                    <form onSubmit={handleGuideProfileSubmit}>
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Hourly Rate */}
                        <div>
                          <label
                            htmlFor="hourlyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Hourly Rate (₹) *
                          </label>
                          <input
                            type="number"
                            id="hourlyRate"
                            name="guide.hourlyRate"
                            min="0"
                            step="50"
                            required
                            value={guideData.hourlyRate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Experience */}
                        <div>
                          <label
                            htmlFor="experience"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Years of Experience *
                          </label>
                          <input
                            type="number"
                            id="experience"
                            name="guide.experience"
                            min="0"
                            max="50"
                            required
                            value={guideData.experience}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Bio */}
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="guideBio"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Professional Bio
                          </label>
                          <textarea
                            id="guideBio"
                            name="guide.bio"
                            rows={4}
                            value={guideData.bio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tell travelers about your guiding style, expertise, and what makes your tours special..."
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Maximum 1000 characters.{" "}
                            {guideData.bio?.length || 0}
                            /1000
                          </p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialties *
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {availableSpecialties.map((specialty) => (
                            <div key={specialty} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`specialty-${specialty}`}
                                value={specialty}
                                checked={guideData.specialties.includes(
                                  specialty
                                )}
                                onChange={handleSpecialtyChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`specialty-${specialty}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {specialty}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages You Speak *
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {[
                            "Hindi",
                            "English",
                            "Tamil",
                            "Telugu",
                            "Bengali",
                            "Marathi",
                            "Gujarati",
                            "Punjabi",
                            "Malayalam",
                            "Kannada",
                            "Other",
                          ].map((language) => (
                            <div key={language} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`guide-language-${language}`}
                                value={language}
                                checked={guideData.languages.includes(language)}
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  if (checked) {
                                    setGuideData((prev) => ({
                                      ...prev,
                                      languages: [...prev.languages, value],
                                    }));
                                  } else {
                                    setGuideData((prev) => ({
                                      ...prev,
                                      languages: prev.languages.filter(
                                        (lang) => lang !== value
                                      ),
                                    }));
                                  }
                                }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`guide-language-${language}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {language}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cities */}
                      <div className="mt-6">
                        <label
                          htmlFor="cityInput"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cities You Guide In *
                        </label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            id="cityInput"
                            placeholder="Add a city (e.g., Mumbai, Delhi, etc.)"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCityChange(e);
                              }
                            }}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input =
                                document.getElementById("cityInput");
                              handleCityChange({ target: input });
                            }}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {guideData.cities.map((city) => (
                            <span
                              key={city}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {city}
                              <button
                                type="button"
                                onClick={() => removeCity(city)}
                                className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-indigo-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Services & Packages */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Services & Packages
                        </label>
                        <div className="space-y-4">
                          {guideData.services.map((service, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Service Name
                                  </label>
                                  <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., Heritage Walk, Food Tour"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Duration (hours)
                                  </label>
                                  <input
                                    type="number"
                                    value={service.duration}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        index,
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="2"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Description
                                  </label>
                                  <textarea
                                    value={service.description}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Describe this service..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        index,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="1000"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove Service
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addService}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + Add Service
                          </button>
                        </div>
                      </div>

                      {/* Weekly Availability */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Weekly Availability
                        </label>
                        <div className="space-y-3">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <div
                              key={day}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                            >
                              <span className="text-sm font-medium text-gray-700">
                                {day}
                              </span>
                              <div className="flex items-center space-x-4">
                                <input
                                  type="checkbox"
                                  checked={guideData.availability.some(
                                    (avail) => avail.day === day
                                  )}
                                  onChange={(e) =>
                                    toggleDayAvailability(day, e.target.checked)
                                  }
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                {guideData.availability.some(
                                  (avail) => avail.day === day
                                ) && (
                                  <div className="flex space-x-2">
                                    <input
                                      type="time"
                                      value={getDaySlots(day).start || ""}
                                      onChange={(e) =>
                                        updateTimeSlot(
                                          day,
                                          "start",
                                          e.target.value
                                        )
                                      }
                                      className="text-sm border border-gray-300 rounded px-2 py-1"
                                    />
                                    <span className="text-gray-500">to</span>
                                    <input
                                      type="time"
                                      value={getDaySlots(day).end || ""}
                                      onChange={(e) =>
                                        updateTimeSlot(
                                          day,
                                          "end",
                                          e.target.value
                                        )
                                      }
                                      className="text-sm border border-gray-300 rounded px-2 py-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Availability Toggle */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isAvailable"
                            name="guide.isAvailable"
                            checked={guideData.isAvailable}
                            onChange={(e) =>
                              setGuideData((prev) => ({
                                ...prev,
                                isAvailable: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isAvailable"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Available for new bookings
                          </label>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving
                            ? "Saving Guide Profile..."
                            : "Save Guide Profile"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Security Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your password and account security
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/auth/change-password")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the main component with ProtectedRoute
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
