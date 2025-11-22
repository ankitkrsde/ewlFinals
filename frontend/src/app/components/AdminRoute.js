"use client";
import { useRequireAdmin } from "../hooks/useAuthGuard";

export default function AdminRoute({
  children,
  redirectTo = "/dashboard",
  fallback = null,
}) {
  const { user, loading } = useRequireAdmin(redirectTo);

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect via the hook
  }

  return children;
}
