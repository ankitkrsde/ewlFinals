"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { api } from "../../utils/app";
import { useRedirectIfAuthenticated } from "../../hooks/useAuthGuard";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      console.log("🔄 Login: Attempting login...");
      const data = await api.login(formData);

      console.log("✅ Login: Response received", data);

      if (data.success) {
        console.log("✅ Login: Success, storing data...");

        // CRITICAL: Make sure we have both token and user
        if (data.token && data.user) {
          console.log("💾 Login: Saving to localStorage...");

          // Save to localStorage FIRST
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("✅ Login: Data saved to localStorage");
            console.log("Token saved:", data.token.substring(0, 20) + "...");
            console.log("User saved:", data.user);
          }

          // THEN call login to update AuthProvider state
          console.log("🔄 Login: Updating AuthProvider state...");
          login(data.token, data.user);

          // THEN redirect
          console.log("🔄 Login: Redirecting to dashboard...");
          router.push("/dashboard");
        } else {
          console.error("❌ Login: Missing token or user in response");
          setError("Invalid response from server");
        }
      } else {
        console.error("❌ Login: API returned success: false");
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login: Error occurred", error);

      // Handle specific error cases
      if (error.message.includes("Cannot connect to backend")) {
        setError(
          "❌ Cannot connect to server. Please make sure the backend is running."
        );
      } else if (error.message.includes("Account temporarily locked")) {
        setError(
          "🔒 Account temporarily locked due to too many login attempts. Try again later."
        );
      } else if (error.message.includes("Account is deactivated")) {
        setError(
          "❌ Your account has been deactivated. Please contact support."
        );
      } else if (error.message.includes("Account has been banned")) {
        setError(
          "🚫 Your account has been banned. Please contact support for more information."
        );
      } else {
        setError(error.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div
              className={`px-4 py-3 rounded ${
                error.includes("✅") || error.includes("successful")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : error.includes("❌") ||
                      error.includes("🔒") ||
                      error.includes("🚫")
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {error.includes("✅") || error.includes("successful") ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          {/* Demo Credentials Hint */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mt-4">
              Demo: Use any registered email and password
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
