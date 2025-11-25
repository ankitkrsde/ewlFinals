// warmup.js - Run this after deployment to warm up the server
const https = require("https");

const warmupEndpoints = [
  "/api/health",
  "/api/auth/register",
  "/api/auth/login",
  "/api/guides",
];

const warmupServer = async () => {
  const baseURL = "https://explorewithlocals-backend.onrender.com";

  console.log("🔥 Warming up server endpoints...");

  for (const endpoint of warmupEndpoints) {
    try {
      const response = await new Promise((resolve, reject) => {
        https
          .get(`${baseURL}${endpoint}`, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve({ statusCode: res.statusCode, data }));
          })
          .on("error", reject);
      });

      console.log(`✅ ${endpoint} - Status: ${response.statusCode}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }

    // Wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("🎯 Server warm-up complete!");
};

warmupServer();
