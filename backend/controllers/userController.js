const User = require("../models/User");
const GuideProfile = require("../models/GuideProfile");
const {
  sendAccountStatusEmail,
  sendBanNotificationEmail,
} = require("../utils/emailService");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search, status } = req.query;

    let query = {};

    // Filter by role
    if (role && role !== "all") {
      query.role = role;
    }

    // Filter by status
    if (status && status !== "all") {
      if (status === "active") {
        query.isActive = true;
        query.banned = false;
      } else if (status === "inactive") {
        query.isActive = false;
        query.banned = false;
      } else if (status === "banned") {
        query.banned = true;
      }
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is guide, include guide profile
    let guideProfile = null;
    if (user.role === "guide") {
      guideProfile = await GuideProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        guideProfile,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error fetching user",
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Make sure user is owner or admin
    if (req.user.role !== "admin" && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // Fields that can be updated
    const allowedFields = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      languages: req.body.languages,
      bio: req.body.bio,
      avatar: req.body.avatar,
    };

    // Remove undefined fields
    Object.keys(allowedFields).forEach((key) => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });

    user = await User.findByIdAndUpdate(req.params.id, allowedFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating user",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Prevent deleting other admin accounts
    if (user.role === "admin" && req.user.id !== userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete other admin accounts",
      });
    }

    await User.findByIdAndDelete(userId);

    console.log("User deleted successfully:", { userId, name: user.name });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Delete user error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error deleting user",
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      isActive: true,
      banned: false,
    });
    const inactiveUsers = await User.countDocuments({
      isActive: false,
      banned: false,
    });
    const bannedUsers = await User.countDocuments({ banned: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // New registrations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const registrationsToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        byRole: stats,
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        banned: bannedUsers,
        recentRegistrations,
        registrationsToday,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user statistics",
    });
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    console.log("Updating user status:", { userId, isActive });

    // Validate input
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === userId && !isActive) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User status updated successfully:", {
      userId: user._id,
      name: user.name,
      newStatus: isActive ? "active" : "inactive",
    });

    // Send email notification
    try {
      await sendAccountStatusEmail(
        user,
        isActive ? "activated" : "deactivated"
      );
      console.log("Status change email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send status email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating user status",
    });
  }
};

// @desc    Ban/Unban user (Admin only)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
exports.banUser = async (req, res, next) => {
  try {
    const { banned, banReason } = req.body;
    const userId = req.params.id;

    console.log("Updating user ban status:", { userId, banned, banReason });

    // Validate input
    if (typeof banned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "banned must be a boolean value",
      });
    }

    // Prevent admin from banning themselves
    if (req.user.id === userId && banned) {
      return res.status(400).json({
        success: false,
        message: "You cannot ban your own account",
      });
    }

    const updateData = {
      banned,
      bannedAt: banned ? Date.now() : null,
      banReason: banned
        ? banReason || "Violation of terms of service"
        : undefined,
      // Also deactivate account when banning
      isActive: banned ? false : true,
    };

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User ban status updated successfully:", {
      userId: user._id,
      name: user.name,
      banned: user.banned,
      banReason: user.banReason,
    });

    // Send email notification
    try {
      await sendBanNotificationEmail(user, banned, banReason);
      console.log("Ban notification email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send ban email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: `User ${banned ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Ban user error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating user ban status",
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    console.log("Updating user role:", { userId, role });

    // Validate input
    if (!["tourist", "guide", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be one of: tourist, guide, admin",
      });
    }

    // Prevent admin from changing their own role
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If changing to guide, create guide profile if it doesn't exist
    if (role === "guide") {
      const existingGuideProfile = await GuideProfile.findOne({
        userId: user._id,
      });
      if (!existingGuideProfile) {
        await GuideProfile.create({
          userId: user._id,
          verificationStatus: "pending",
        });
        console.log("Guide profile created for user:", user._id);
      }
    }

    console.log("User role updated successfully:", {
      userId: user._id,
      name: user.name,
      newRole: role,
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update user role error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating user role",
    });
  }
};
