const User = require("../models/User");
const GuideProfile = require("../models/GuideProfile");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalGuides,
      totalBookings,
      totalRevenue,
      pendingVerifications,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      GuideProfile.countDocuments({ verificationStatus: "approved" }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      GuideProfile.countDocuments({ verificationStatus: "pending" }),
      Booking.find()
        .populate("touristId", "name")
        .populate("guideId", "name")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGuides,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingVerifications,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guide verification requests
// @route   GET /api/admin/verifications
// @access  Private/Admin
exports.getVerificationRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) {
      query.verificationStatus = status;
    }

    const verifications = await GuideProfile.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GuideProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: verifications.length,
      total,
      data: verifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guide verification status
// @route   PUT /api/admin/verifications/:id
// @access  Private/Admin
exports.updateVerificationStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either approved or rejected",
      });
    }

    const guideProfile = await GuideProfile.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: status,
        ...(status === "rejected" && { rejectionReason }),
      },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    // If approved, update user role to guide
    if (status === "approved") {
      await User.findByIdAndUpdate(guideProfile.userId._id, { role: "guide" });
    }

    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsersAdmin = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate review
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
exports.moderateReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).populate("touristId", "name");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update guide rating if review is approved
    if (isApproved) {
      const GuideProfile = require("../models/GuideProfile");
      const reviews = await Review.find({
        guideId: review.guideId,
        isApproved: true,
      });

      const totalRating = reviews.reduce((sum, r) => sum + r.rating.overall, 0);
      const avgRating = totalRating / reviews.length;

      await GuideProfile.findOneAndUpdate(
        { userId: review.guideId },
        {
          "rating.average": parseFloat(avgRating.toFixed(1)),
          "rating.count": reviews.length,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
