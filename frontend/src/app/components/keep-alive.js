"use client";
import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    const warmUpEndpoints = async () => {
      const endpoints = [
        "/api/health",
        "/api/auth/register",
        "/api/auth/login",
        "/api/guides",
      ];

      const baseURL = "https://explorewithlocals-backend.onrender.com";

      // Warm up all critical endpoints
      for (const endpoint of endpoints) {
        try {
          await fetch(`${baseURL}${endpoint}`, {
            method: "GET",
            // Short timeout just to wake up the endpoint
            signal: AbortSignal.timeout(5000),
          });
          console.log(`🔥 Warmed up: ${endpoint}`);
        } catch (error) {
          // Ignore timeouts - we just want to wake up the server
          console.log(`⚡ Triggered: ${endpoint}`);
        }

        // Small delay between endpoints
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    const keepServerAwake = async () => {
      try {
        console.log("🔄 Pinging server...");
        const response = await fetch(
          "https://explorewithlocals-backend.onrender.com/api/health",
          {
            signal: AbortSignal.timeout(10000),
          }
        );

        if (response.ok) {
          console.log("✅ Server is awake and responsive");
        }
      } catch (error) {
        console.log("❌ Server ping failed or timed out");
      }
    };

    // When user first visits, warm up ALL critical endpoints
    warmUpEndpoints();

    // Then ping every 8 minutes (more frequent than 15-minute sleep)
    const interval = setInterval(keepServerAwake, 8 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
