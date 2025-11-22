const GuideProfile = require("../models/GuideProfile");
const User = require("../models/User");
const Review = require("../models/Review");
const Booking = require("../models/Booking");

// @desc    Get all guides with advanced filters
// @route   GET /api/guides
// @access  Public
exports.getGuides = async (req, res, next) => {
  try {
    const {
      city,
      language,
      minPrice,
      maxPrice,
      specialty,
      rating,
      experience,
      sort,
      includePending,
    } = req.query;

    // Build filter object
    let filter = {
      isAvailable: true,
    };

    // Include pending guides if requested (for debugging)
    if (includePending === "true") {
      delete filter.isAvailable;
    }

    // City filter (case-insensitive partial match)
    if (city) {
      filter.cities = { $regex: city, $options: "i" };
    }

    // Language filter (exact match)
    if (language) {
      filter.languages = language;
    }

    // Specialty filter (exact match)
    if (specialty) {
      filter.specialties = specialty;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = parseInt(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = parseInt(maxPrice);
    }

    // Minimum rating filter
    if (rating) {
      filter["rating.average"] = { $gte: parseFloat(rating) };
    }

    // Minimum experience filter
    if (experience) {
      filter.experience = { $gte: parseInt(experience) };
    }

    console.log("🔍 Filter criteria:", filter);

    // Build sort options
    let sortOptions = {};
    if (sort === "-rating") {
      sortOptions = { "rating.average": -1 };
    } else if (sort === "hourlyRate") {
      sortOptions = { hourlyRate: 1 };
    } else if (sort === "-experience") {
      sortOptions = { experience: -1 };
    } else {
      sortOptions = { "rating.average": -1 }; // default: highest rated first
    }

    const guides = await GuideProfile.find(filter)
      .populate("userId", "name avatar email")
      .sort(sortOptions);

    console.log(`🎯 Found ${guides.length} guides`);

    // DEBUG: Log each guide's rating information
    console.log("📊 GUIDE RATINGS DEBUG:");
    guides.forEach((guide, index) => {
      console.log(`Guide ${index + 1}: ${guide.userId?.name}`, {
        guideId: guide._id,
        userId: guide.userId?._id,
        rating: guide.rating,
        hasRating: !!guide.rating,
        average: guide.rating?.average,
        count: guide.rating?.count,
        breakdown: guide.rating?.breakdown,
      });
    });

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    console.error("❌ Error fetching guides:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching guides",
    });
  }
};

// @desc    Get single guide by user ID
// @route   GET /api/guides/:id
// @access  Public
exports.getGuide = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({
      userId: req.params.id,
    }).populate("userId", "name email avatar phone location languages");

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Get reviews for this guide
    const reviews = await Review.find({ guideId: guide.userId._id })
      .populate("touristId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate current rating stats from reviews
    const ratingStats = await Review.aggregate([
      {
        $match: {
          guideId: guide.userId._id,
          isApproved: true,
        },
      },
      {
        $group: {
          _id: "$guideId",
          averageOverall: { $avg: "$rating.overall" },
          averageKnowledge: { $avg: "$rating.knowledge" },
          averageCommunication: { $avg: "$rating.communication" },
          averagePunctuality: { $avg: "$rating.punctuality" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const stats = ratingStats.length > 0 ? ratingStats[0] : null;

    // Update guide's rating in the response if different from stored
    const responseGuide = guide.toObject();
    if (stats) {
      responseGuide.rating = {
        average: Math.round(stats.averageOverall * 10) / 10,
        count: stats.totalReviews,
        breakdown: {
          knowledge: Math.round(stats.averageKnowledge * 10) / 10,
          communication: Math.round(stats.averageCommunication * 10) / 10,
          punctuality: Math.round(stats.averagePunctuality * 10) / 10,
        },
      };
    }

    res.status(200).json({
      success: true,
      data: {
        guide: responseGuide,
        reviews,
        ratingStats: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update guide profile
// @route   POST /api/guides
// @route   PUT /api/guides/:id
// @access  Private/Guide
exports.createUpdateGuideProfile = async (req, res, next) => {
  try {
    console.log("🔧 BACKEND: createUpdateGuideProfile called with:", req.body);

    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can create/update guide profiles",
      });
    }

    let guideProfile = await GuideProfile.findOne({ userId: req.user.id });

    if (guideProfile) {
      console.log("🔧 BACKEND: Updating existing profile with $set");
      // FIXED: Use $set to only update provided fields
      guideProfile = await GuideProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: req.body }, // CRITICAL: Use $set operator
        {
          new: true,
          runValidators: true,
        }
      ).populate("userId", "name email avatar");

      res.status(200).json({
        success: true,
        data: guideProfile,
      });
    } else {
      console.log("🔧 BACKEND: Creating new profile");
      // Create new profile
      guideProfile = await GuideProfile.create({
        userId: req.user.id,
        ...req.body,
      });

      await guideProfile.populate("userId", "name email avatar");

      res.status(201).json({
        success: true,
        data: guideProfile,
      });
    }
  } catch (error) {
    console.error("❌ BACKEND: Error in createUpdateGuideProfile:", error);
    next(error);
  }
};

// @desc    Update guide profile (separate from create)
// @route   PUT /api/guides/profile
// @access  Private/Guide
exports.updateGuideProfile = async (req, res, next) => {
  try {
    console.log("🔧 BACKEND: updateGuideProfile called with body:", req.body);

    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can update guide profiles",
      });
    }

    // Find the existing guide profile first
    const existingProfile = await GuideProfile.findOne({ userId: req.user.id });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    console.log("🔧 BACKEND: Existing profile:", {
      hourlyRate: existingProfile.hourlyRate,
      experience: existingProfile.experience,
      bio: existingProfile.bio,
      specialties: existingProfile.specialties,
      cities: existingProfile.cities,
      languages: existingProfile.languages,
    });

    // Create update object with ONLY the fields that are provided in request
    // This ensures we don't overwrite fields that aren't sent
    const updateFields = {};

    // List of allowed fields to update
    const allowedFields = [
      "hourlyRate",
      "experience",
      "bio",
      "specialties",
      "languages",
      "cities",
      "services",
      "availability",
      "isAvailable",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    console.log("🔧 BACKEND: Fields to update:", updateFields);

    // Use findOneAndUpdate with $set to only update provided fields
    const guideProfile = await GuideProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateFields }, // CRITICAL: Use $set operator
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "name email avatar phone location languages");

    console.log("✅ BACKEND: Updated profile:", {
      hourlyRate: guideProfile.hourlyRate,
      experience: guideProfile.experience,
      bio: guideProfile.bio,
      specialties: guideProfile.specialties,
      cities: guideProfile.cities,
      languages: guideProfile.languages,
    });

    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    console.error("❌ BACKEND: Error updating guide profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating guide profile",
    });
  }
};

// @desc    Get guides by city
// @route   GET /api/guides/city/:city
// @access  Public
exports.getGuidesByCity = async (req, res, next) => {
  try {
    const guides = await GuideProfile.find({
      cities: { $regex: req.params.city, $options: "i" },
      isAvailable: true,
    })
      .populate("userId", "name email avatar languages")
      .sort("-rating.average");

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's guide profile
// @route   GET /api/guides/me
// @access  Private/Guide
exports.getMyGuideProfile = async (req, res, next) => {
  try {
    console.log("=== getMyGuideProfile START ===");
    console.log("User ID:", req.user?.id);
    console.log("User Role:", req.user?.role);

    if (req.user.role !== "guide") {
      console.log("❌ User is not a guide, role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Only guides can access this resource",
      });
    }

    console.log("🔍 Looking for guide profile for user:", req.user.id);

    const guideProfile = await GuideProfile.findOne({
      userId: req.user.id,
    }).populate("userId", "name email avatar phone location languages");

    if (!guideProfile) {
      console.log("ℹ️ No guide profile found - returning 404");
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    console.log("✅ Guide profile found:", guideProfile._id);
    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    console.error("❌ Error in getMyGuideProfile:", error);
    next(error);
  }
};

// @desc    Check guide availability for a specific date
// @route   GET /api/guides/:id/availability
// @access  Public
exports.checkGuideAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    const guideId = req.params.id;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const guide = await GuideProfile.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Check if guide is generally available
    if (!guide.isAvailable) {
      return res.status(200).json({
        success: true,
        data: {
          isAvailable: false,
          reason: "Guide is currently unavailable",
          availableSlots: [],
        },
      });
    }

    // Check for existing bookings on that date
    const existingBookings = await Booking.find({
      guideId: guide.userId,
      date: new Date(date),
      status: { $in: ["confirmed", "pending"] },
    });

    // Get guide's availability for that day
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = guide.availability.find(
      (avail) => avail.day === dayName
    );

    let availableSlots = [];

    if (dayAvailability) {
      // Filter out slots that are already booked
      availableSlots = dayAvailability.slots.filter((slot) => {
        const isBooked = existingBookings.some(
          (booking) => booking.startTime === slot.start
        );
        return !isBooked;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isAvailable: availableSlots.length > 0,
        availableSlots,
        dayAvailability: dayAvailability || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guide availability
// @route   PUT /api/guides/availability
// @access  Private/Guide
exports.updateAvailability = async (req, res, next) => {
  try {
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can update availability",
      });
    }

    const guideProfile = await GuideProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          availability: req.body.availability,
          isAvailable: req.body.isAvailable,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guide statistics
// @route   GET /api/guides/stats
// @access  Private/Guide
exports.getGuideStats = async (req, res, next) => {
  try {
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can access this resource",
      });
    }

    const guideProfile = await GuideProfile.findOne({ userId: req.user.id });
    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    // Get booking statistics
    const totalBookings = await Booking.countDocuments({
      guideId: req.user.id,
    });

    const completedBookings = await Booking.countDocuments({
      guideId: req.user.id,
      status: "completed",
    });

    const pendingBookings = await Booking.countDocuments({
      guideId: req.user.id,
      status: "pending",
    });

    // Get review statistics
    const totalReviews = await Review.countDocuments({
      guideId: req.user.id,
    });

    // Calculate total earnings (you might want to add this field to your Booking model)
    const earningsData = await Booking.aggregate([
      {
        $match: {
          guideId: req.user.id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalEarnings =
      earningsData.length > 0 ? earningsData[0].totalEarnings : 0;

    res.status(200).json({
      success: true,
      data: {
        profile: guideProfile,
        stats: {
          totalBookings,
          completedBookings,
          pendingBookings,
          totalReviews,
          totalEarnings,
          rating: guideProfile.rating.average,
          experience: guideProfile.experience,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching guide stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching guide statistics",
    });
  }
};

// @desc    Get guide earnings
// @route   GET /api/guides/earnings
// @access  Private/Guide
exports.getGuideEarnings = async (req, res, next) => {
  try {
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can access earnings data",
      });
    }

    // Get guide's completed bookings to calculate earnings
    const completedBookings = await Booking.find({
      guideId: req.user.id,
      status: "completed",
    }).populate("touristId", "name");

    const pendingBookings = await Booking.find({
      guideId: req.user.id,
      status: "confirmed",
    }).populate("touristId", "name");

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + (booking.price || 0),
      0
    );
    const pendingEarnings = pendingBookings.reduce(
      (sum, booking) => sum + (booking.price || 0),
      0
    );

    // You can add more sophisticated earnings calculation here
    // including monthly breakdown, service-wise earnings, etc.

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        pendingEarnings,
        completedEarnings: totalEarnings,
        recentTransactions: completedBookings.map((booking) => ({
          id: booking._id,
          touristName: booking.touristId?.name || "Tourist",
          date: booking.date,
          amount: booking.price,
          status: "completed",
          service: booking.serviceType || "Tour Service",
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching guide earnings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching earnings data",
    });
  }
};

// @desc    Force update guide ratings (for debugging)
// @route   POST /api/guides/force-update-ratings
// @access  Private/Admin
exports.forceUpdateGuideRatings = async (req, res, next) => {
  try {
    console.log("🔄 Force updating all guide ratings...");

    const guides = await GuideProfile.find({});
    console.log(`📊 Found ${guides.length} guides to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const guide of guides) {
      try {
        // Get all approved reviews for this guide
        const reviews = await Review.find({
          guideId: guide.userId,
          isApproved: true,
        });

        console.log(
          `📝 Guide ${guide.userId?.name}: ${reviews.length} reviews`
        );

        if (reviews.length === 0) {
          // Reset rating if no reviews
          await GuideProfile.findByIdAndUpdate(guide._id, {
            "rating.average": 0,
            "rating.count": 0,
            "rating.breakdown.knowledge": 0,
            "rating.breakdown.communication": 0,
            "rating.breakdown.punctuality": 0,
          });
          console.log(`🔄 Reset rating for guide: ${guide.userId?.name}`);
        } else {
          // Calculate new ratings
          const totalOverall = reviews.reduce(
            (sum, review) => sum + (review.rating.overall || 0),
            0
          );
          const avgOverall = totalOverall / reviews.length;

          const knowledgeTotal = reviews.reduce(
            (sum, review) =>
              sum + (review.rating.knowledge || review.rating.overall || 0),
            0
          );
          const communicationTotal = reviews.reduce(
            (sum, review) =>
              sum + (review.rating.communication || review.rating.overall || 0),
            0
          );
          const punctualityTotal = reviews.reduce(
            (sum, review) =>
              sum + (review.rating.punctuality || review.rating.overall || 0),
            0
          );

          const updateData = {
            "rating.average": parseFloat(avgOverall.toFixed(1)),
            "rating.count": reviews.length,
            "rating.breakdown.knowledge": parseFloat(
              (knowledgeTotal / reviews.length).toFixed(1)
            ),
            "rating.breakdown.communication": parseFloat(
              (communicationTotal / reviews.length).toFixed(1)
            ),
            "rating.breakdown.punctuality": parseFloat(
              (punctualityTotal / reviews.length).toFixed(1)
            ),
          };

          await GuideProfile.findByIdAndUpdate(guide._id, updateData);
          console.log(
            `✅ Updated ${guide.userId?.name}: ${updateData["rating.average"]} avg, ${updateData["rating.count"]} reviews`
          );
        }

        updatedCount++;
      } catch (error) {
        console.error(`💥 Error updating guide ${guide.userId?.name}:`, error);
        errorCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Force updated ${updatedCount} guides, ${errorCount} errors`,
      updatedCount,
      errorCount,
    });
  } catch (error) {
    console.error("💥 Error force updating guide ratings:", error);
    res.status(500).json({
      success: false,
      message: "Error force updating guide ratings",
    });
  }
};
