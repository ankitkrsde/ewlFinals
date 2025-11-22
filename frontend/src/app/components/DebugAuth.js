"use client";
import { useAuth } from "./AuthProvider";

export default function DebugAuth() {
  const { user, loading } = useAuth();

  if (typeof window === "undefined") return null;

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div>Auth Debug:</div>
      <div>Loading: {loading ? "Yes" : "No"}</div>
      <div>User: {user ? user.name : "None"}</div>
      <div>Token: {localStorage.getItem("token") ? "Exists" : "None"}</div>
      <div>User Data: {localStorage.getItem("user") ? "Exists" : "None"}</div>
    </div>
  );
}
