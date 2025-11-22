"use client";
import { useState, useRef } from "react";
import { api } from "../utils/app";
import Image from "next/image";

export default function AvatarUpload({
  currentAvatar,
  onAvatarUpdate,
  userId,
  size = "lg",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const data = await api.upload("/api/auth/upload-avatar", formData);

      console.log("Upload response:", data);

      if (data.success) {
        setPreviewUrl("");
        if (onAvatarUpdate) {
          // Add cache-busting timestamp
          const timestamp = Date.now();
          const avatarUrl = `${data.data.avatar}?t=${timestamp}`;
          console.log("Setting avatar URL with cache busting:", avatarUrl);

          // Force the image to reload by creating a new image object
          const img = new Image();
          img.onload = () => {
            console.log("✅ Image pre-loaded successfully");
            // Update the avatar in parent component
            onAvatarUpdate(avatarUrl);
          };
          img.onerror = () => {
            console.log("❌ Image failed to pre-load, but updating anyway");
            onAvatarUpdate(avatarUrl);
          };
          img.src = avatarUrl;
        }
      } else {
        setError(data.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setError(error.message || "Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar || currentAvatar.includes("default-avatar")) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      console.log("Removing avatar...");
      const data = await api.deleteAvatar();

      console.log("Remove avatar response:", data);

      if (data.success) {
        if (onAvatarUpdate) {
          onAvatarUpdate("/images/default-avatar.jpg");
        }
      } else {
        setError(data.message || "Failed to remove avatar");
      }
    } catch (error) {
      console.error("Avatar removal error:", error);
      setError(error.message || "Failed to remove avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar =
    previewUrl || currentAvatar || "/images/default-avatar.jpg";

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm max-w-xs text-center">
          {error}
        </div>
      )}

      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center`}
        >
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <Image
              src={displayAvatar}
              width={100}
              height={100}
              alt="Profile avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/default-avatar.jpg";
              }}
            />
          )}
        </div>

        {/* Upload Overlay */}
        {!uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="bg-white bg-opacity-90 rounded-full p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              title="Change avatar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* File Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 w-full max-w-xs">
        <button
          onClick={triggerFileInput}
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {uploading ? "Uploading..." : "Change Avatar"}
        </button>

        {currentAvatar && !currentAvatar.includes("default-avatar") && (
          <button
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {uploading ? "Removing..." : "Remove Avatar"}
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Supported formats: JPEG, PNG, GIF, WebP</p>
        <p>Max file size: 5MB</p>
      </div>
    </div>
  );
}
