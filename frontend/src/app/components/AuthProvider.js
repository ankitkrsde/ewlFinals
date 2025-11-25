"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to validate token with backend
  const validateToken = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = `${apiUrl}/api/auth/verify-token`;
      console.log("🔐 Validating token with URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Validation response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Token validation successful:", data);
        return { valid: true, user: data.data?.user || data.user };
      } else {
        // Handle different error statuses
        if (response.status === 401) {
          console.log("❌ Token invalid or expired (401)");
          return { valid: false, error: "Token expired or invalid" };
        } else if (response.status === 404) {
          console.log("❌ Verify token endpoint not found (404)");
          return {
            valid: false,
            error: "Authentication endpoint not available",
          };
        } else {
          const errorText = await response.text();
          console.log(
            "❌ Token validation failed. Status:",
            response.status,
            "Response:",
            errorText
          );
          try {
            const errorData = JSON.parse(errorText);
            return {
              valid: false,
              error: errorData.message || "Validation failed",
            };
          } catch {
            return { valid: false, error: errorText || "Validation failed" };
          }
        }
      }
    } catch (error) {
      console.error("💥 Token validation network error:", error);
      return { valid: false, error: "Network error during validation" };
    }
  };

  // Fallback validation - use stored user data if token validation fails
  const validateStoredUser = (userData) => {
    try {
      const parsedUser = JSON.parse(userData);
      // Basic validation of user data structure
      if (parsedUser && parsedUser.id && parsedUser.email) {
        console.log("✅ Using stored user data (fallback):", parsedUser.name);
        return { valid: true, user: parsedUser };
      }
      return { valid: false, error: "Invalid user data structure" };
    } catch (error) {
      console.error("❌ Error parsing stored user data:", error);
      return { valid: false, error: "Corrupted user data" };
    }
  };

  useEffect(() => {
    console.log("🔄 AuthProvider: Starting auth check...");

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        console.log("📦 Retrieved from localStorage:", {
          token: token ? `Present (${token.substring(0, 20)}...)` : "Missing",
          userData: userData ? "Present" : "Missing",
        });

        if (token && userData) {
          console.log("🔐 Starting token validation...");
          const validation = await validateToken(token);

          if (validation.valid) {
            // Token is valid, use the user data from validation response
            setUser(validation.user);
            // Update localStorage with fresh user data if available
            if (validation.user) {
              localStorage.setItem("user", JSON.stringify(validation.user));
            }
          } else {
            console.log("❌ Token validation failed:", validation.error);

            // Fallback: try to use stored user data if token validation fails
            const fallbackValidation = validateStoredUser(userData);
            if (fallbackValidation.valid) {
              console.log("🔄 Using fallback user data");
              setUser(fallbackValidation.user);
            } else {
              console.log("❌ Fallback also failed, clearing auth data");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        } else {
          console.log("❌ No token or user data found");
          // Clear any partial data
          if (token && !userData) {
            localStorage.removeItem("token");
          }
          if (userData && !token) {
            localStorage.removeItem("user");
          }
          setUser(null);
        }
      } catch (error) {
        console.error("💥 Auth check unexpected error:", error);
        // Clear auth data on unexpected errors
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        console.log("🏁 Auth check complete, loading false");
        setLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      checkAuth();
    }, 100);
  }, []);

  const login = (token, userData) => {
    console.log("🔐 Logging in user:", userData?.name || "Unknown");

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    setUser(userData);
  };

  const logout = () => {
    console.log("🚪 Logging out");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    console.log("🔄 Updating user data");
    setUser(updatedUser);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
