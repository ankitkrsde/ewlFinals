"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const AuthContext = createContext();

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
    // Check if user is logged in on component mount
    const checkAuth = () => {
      try {

        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          const userData = localStorage.getItem("user");

          if (token && userData) {
            setUser(JSON.parse(userData));
          }

       
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid data

        if (typeof window !== "undefined") {
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

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }

  
    setUser(userData);
  };

  const logout = () => {

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    window.location.href = "/";

   
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
