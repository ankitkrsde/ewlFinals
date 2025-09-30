"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create the context with a default value
const AuthContext = createContext(undefined);

// Custom hook to use the auth context
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

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Safely check for window and localStorage
        if (typeof window === "undefined" || !window.localStorage) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid data
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    // Use router instead of direct window.location for better SPA experience
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
