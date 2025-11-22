const path = require("path");
const fs = require("fs");

// Supported image types
const supportedMimeTypes = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

// Validate file
const validateFile = (file) => {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Check file type
  if (!supportedMimeTypes[file.mimetype]) {
    return {
      isValid: false,
      error:
        "Unsupported file type. Please upload JPEG, PNG, GIF, or WebP images.",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 5MB.",
    };
  }

  return { isValid: true };
};

// Generate unique filename
const generateFilename = (originalName, mimetype) => {
  const extension = supportedMimeTypes[mimetype];
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `avatar_${timestamp}_${randomString}.${extension}`;
};

// Save file to disk
const saveFile = async (file, uploadPath) => {
  try {
    // Ensure upload directory exists
    const uploadDir = path.dirname(uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(uploadPath, file.buffer);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete old file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath) && !filePath.includes("default-avatar")) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};

// Main upload function
exports.uploadAvatar = async (file, userId) => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Generate filename and path
    const filename = generateFilename(file.originalname, file.mimetype);
    const uploadPath = path.join(__dirname, "../uploads/avatars", filename);
    const publicPath = `/uploads/avatars/${filename}`;

    // Save file
    const saveResult = await saveFile(file, uploadPath);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return {
      success: true,
      filename,
      filePath: uploadPath,
      publicPath,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
};

// Delete avatar file
exports.deleteAvatar = async (avatarPath) => {
  if (!avatarPath || avatarPath.includes("default-avatar")) {
    return { success: true };
  }

  const filename = path.basename(avatarPath);
  const filePath = path.join(__dirname, "../uploads/avatars", filename);

  return deleteFile(filePath);
};
