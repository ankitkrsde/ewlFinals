// Centralized configuration constants
export const CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    TIMEOUT: 30000, // 30 seconds
  },
  APP: {
    NAME: "Explore With Locals",
    VERSION: "1.0.0",
    CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
  },
  FEATURES: {
    ENABLE_ANALYTICS: process.env.NODE_ENV === "production",
    ENABLE_DEBUG: process.env.NODE_ENV !== "production",
  },
};

// Environment detection
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
