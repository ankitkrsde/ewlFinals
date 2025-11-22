"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { api } from "../../utils/app";
import { useRedirectIfAuthenticated } from "../../hooks/useAuthGuard";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tourist",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "India",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  useRedirectIfAuthenticated();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Register: Attempting registration...");
      const data = await api.register(formData);

      console.log("✅ Register: Response received", data);

      if (data.success) {
        console.log("✅ Register: Success, storing data...");

        // CRITICAL: Make sure we have both token and user
        if (data.token && data.user) {
          console.log("💾 Register: Saving to localStorage...");

          // Save to localStorage FIRST
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("✅ Register: Data saved to localStorage");
            console.log("Token saved:", data.token.substring(0, 20) + "...");
            console.log("User saved:", data.user);
          }

          // THEN call login to update AuthProvider state
          console.log("🔄 Register: Updating AuthProvider state...");
          login(data.token, data.user);

          // THEN redirect
          console.log("🔄 Register: Redirecting to dashboard...");
          router.push("/dashboard");
        } else {
          console.error("❌ Register: Missing token or user in response");
          setError("Invalid response from server");
        }
      } else {
        console.error("❌ Register: API returned success: false");
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Register: Error occurred", error);
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <input
              type="tel"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <select
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="tourist">Tourist</option>
              <option value="guide">Local Guide</option>
            </select>

            <input
              type="text"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="City"
              value={formData.location.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
