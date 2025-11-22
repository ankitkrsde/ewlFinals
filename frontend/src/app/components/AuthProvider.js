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
      console.log(
        "🔐 Validating token with URL:",
        `${apiUrl}/api/auth/verify-token`
      );

      const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("📡 Validation response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Token validation successful:", data);
        return { valid: true, user: data.data.user };
      } else {
        const errorData = await response.json();
        console.log("❌ Token validation failed:", errorData);
        return { valid: false, error: errorData };
      }
    } catch (error) {
      console.error("💥 Token validation network error:", error);
      return { valid: false, error: error.message };
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
            try {
              const parsedUser = JSON.parse(userData);
              console.log("✅ Token valid, setting user:", parsedUser.name);
              setUser(parsedUser);
            } catch (parseError) {
              console.error("❌ Error parsing user data:", parseError);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          } else {
            console.log("❌ Token invalid, reason:", validation.error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          console.log("❌ No token or user data found");
          setUser(null);
        }
      } catch (error) {
        console.error("💥 Auth check unexpected error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        console.log("🏁 Auth check complete, loading false");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    console.log("🔐 Logging in user:", userData.name);

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
