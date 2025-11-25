"use client";
import { useState, useRef } from "react";
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
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const timeoutRef = useRef(null);

  useRedirectIfAuthenticated();

  // In your signup component - replace the current handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeoutWarning(false);
    setSuccess(false);

    let requestCompleted = false;

    // Set timeout warning after 5 seconds (sooner)
    timeoutRef.current = setTimeout(() => {
      if (!requestCompleted) {
        setTimeoutWarning(true);
      }
    }, 5000);

    // Set ultimate timeout after 25 seconds
    const ultimateTimeout = setTimeout(() => {
      if (!requestCompleted) {
        clearTimeout(timeoutRef.current);
        setError(
          "This is taking longer than expected. Your account is being created in the background. You can try logging in shortly."
        );
        setLoading(false);
        requestCompleted = true;
      }
    }, 25000);

    try {
      console.log("🔄 Register: Attempting registration...");
      const data = await api.register(formData);

      requestCompleted = true;
      clearTimeout(timeoutRef.current);
      clearTimeout(ultimateTimeout);

      if (data.success) {
        setSuccess(true);

        if (data.token && data.user) {
          // Save and redirect
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          }

          login(data.token, data.user);
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      requestCompleted = true;
      clearTimeout(timeoutRef.current);
      clearTimeout(ultimateTimeout);

      if (error.message.includes("timeout")) {
        setError(
          "Account creation is processing. Please check your email or try logging in shortly."
        );
      } else {
        setError(error.message || "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup timeout on unmount
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
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
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Account created successfully! Redirecting...
            </div>
          )}

          {/* Timeout Warning */}
          {timeoutWarning && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              ⏳ Server is waking up... This may take a moment. Your request is
              being processed.
            </div>
          )}

          {/* Error Message */}
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
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </div>

          {/* Help text for cold starts */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              First time? Server may take 10-15 seconds to wake up. Subsequent
              requests will be faster.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
