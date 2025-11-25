"use client";
import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    const keepServerAwake = async () => {
      try {
        const response = await fetch(
          "https://explorewithlocals-backend.onrender.com/api/health"
        );
        console.log("✅ Server pinged successfully");
      } catch (error) {
        console.log("❌ Server ping failed");
      }
    };

    // Ping immediately when component mounts
    keepServerAwake();

    // Ping every 10 minutes (600,000 ms)
    const interval = setInterval(keepServerAwake, 10 * 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
