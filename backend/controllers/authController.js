const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const GuideProfile = require("../models/GuideProfile");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
const { uploadAvatar, deleteAvatar } = require("../utils/fileUpload");
const multer = require("multer");

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Generate JWT Token

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      banned: user.banned,
      // REMOVE isEmailVerified from here
    },
  });
};

// @desc    Verify token validity
// @route   GET /api/auth/verify-token
// @access  Private
exports.verifyToken = async (req, res, next) => {
  try {
    // If we reach here, the protect middleware has already validated the token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
        },
        valid: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Validation (keep existing)
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user (auto-verified)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "tourist",
      phone: phone || "",
      location: location || {},
    });

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(user);
      console.log("Welcome email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue registration even if email fails
    }

    // If user is registering as guide, create guide profile
    // If user is registering as guide, create guide profile
    if (role === "guide") {
      try {
        const guideProfile = await GuideProfile.create({
          userId: user._id,
          verificationStatus: "pending",
          hourlyRate: 0,
          documents: {
            idProof: "",
            addressProof: "",
            verificationPhoto: "",
          },
          cities: [location?.city || ""].filter(Boolean),
          isAvailable: true,
          bio: "",
          specialties: [],
          experience: 0,
          services: [],
          availability: [],
          languages: [],
        });
        console.log("✅ GUIDE PROFILE CREATED SUCCESSFULLY:", {
          userId: user._id,
          guideId: guideProfile._id,
          name: user.name,
        });
      } catch (guideError) {
        console.error("❌ GUIDE PROFILE CREATION FAILED:", guideError);
      }
    }
    // Send token response immediately
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    // Check for user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user can login
    const loginCheck = user.canLogin();
    if (!loginCheck.canLogin) {
      return res.status(401).json({
        success: false,
        message: loginCheck.reason,
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await User.findByIdAndUpdate(user._id, {
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 },
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    console.log("Uploaded file:", req.file);

    // Create relative path for database
    const avatarRelativePath = `/uploads/avatars/${req.file.filename}`;

    // Update user with avatar filename
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarRelativePath,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        // FIX: Use the backend API URL, not frontend URL
        avatar: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }${avatarRelativePath}`,
      },
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 5MB",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error during avatar upload",
    });
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/auth/deleteAvatar
// @access  Private
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("Current avatar:", user.avatar);

    if (!user.avatar || user.avatar.includes("default-avatar")) {
      console.log("No custom avatar to remove");
      return res.status(400).json({
        success: false,
        message: "No custom avatar to remove",
      });
    }

    // Extract filename from avatar path
    let filename;
    if (user.avatar.includes("http")) {
      // If avatar is full URL like "http://localhost:5000/uploads/avatars/filename.jpg"
      filename = user.avatar.split("/").pop();
    } else {
      // If avatar is relative path like "/uploads/avatars/filename.jpg"
      filename = user.avatar.split("/").pop();
    }

    console.log("Filename to delete:", filename);

    // Delete file from filesystem
    const filePath = path.join(__dirname, "../uploads/avatars", filename);
    console.log("Full file path:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("✅ File deleted successfully from filesystem");
    } else {
      console.log(
        "⚠️ File not found in filesystem, but continuing with database update"
      );
    }

    // Update user to default avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: "/images/default-avatar.jpg" },
      { new: true }
    );

    console.log("✅ User updated with default avatar in database");

    res.status(200).json({
      success: true,
      data: {
        avatar: "/images/default-avatar.jpg",
      },
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("❌ Delete avatar error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error during avatar removal: " + error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether email exists or not for security
      console.log("Password reset requested for non-existent email:", email);
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    // Check if user can reset password (not banned and active)
    if (user.banned) {
      return res.status(400).json({
        success: false,
        message: "Account has been banned. Cannot reset password.",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account is deactivated. Cannot reset password.",
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    console.log("Password reset token generated for user:", user._id);

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    try {
      // Send password reset email
      await sendPasswordResetEmail(user, resetToken);
      console.log("Password reset email sent to:", user.email);

      res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // Reset the tokens if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset process",
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    console.log("Password reset attempt with token");

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide reset token and new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Check if user can reset password
    if (user.banned) {
      return res.status(400).json({
        success: false,
        message: "Account has been banned. Cannot reset password.",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account is deactivated. Cannot reset password.",
      });
    }

    console.log("Resetting password for user:", user._id);

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("Password reset successful for user:", user._id);

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log("🔄 Resend verification requested for:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether email exists for security
      console.log("❌ User not found for email:", email);
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a verification email has been sent",
      });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      console.log("✅ Email already verified for:", email);
      return res.status(400).json({
        success: false,
        message: "Email is already verified. You can login directly.",
      });
    }

    console.log("🔄 Generating new verification token for:", email);

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    console.log("✅ New token generated for:", email);

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
      console.log("✅ Verification email sent to:", email);

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError);
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification resend",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      languages: req.body.languages,
      bio: req.body.bio,
      avatar: req.body.avatar,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating user details",
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating password",
    });
  }
};
