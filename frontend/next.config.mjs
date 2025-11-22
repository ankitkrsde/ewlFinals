/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the rewrites - we'll use environment variables instead
  async rewrites() {
    // Only use rewrites in development
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }
    return [];
  },
  // Enable trailing slashes for better SEO
  trailingSlash: false,
  // Enable React strict mode
  reactStrictMode: true,
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Add images configuration if you're using next/image
  images: {
    domains: ["localhost", "your-backend-domain.vercel.app"],
    unoptimized: true, // Required for static exports if needed
  },
  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
  },
};

export default nextConfig;
