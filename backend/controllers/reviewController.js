const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const GuideProfile = require("../models/GuideProfile");

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment, photos } = req.body;

    console.log("🎯 Creating review for booking:", bookingId);

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId).populate(
      "guideId",
      "name"
    );
    console.log("📦 Booking found:", {
      id: booking?._id,
      guideId: booking?.guideId?._id,
      guideName: booking?.guideId?.name,
      status: booking?.status,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only review completed bookings",
      });
    }

    // Check if user is the tourist who made the booking
    if (booking.touristId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this booking",
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already exists for this booking",
      });
    }

    // Validate rating structure
    if (!rating || !rating.overall) {
      return res.status(400).json({
        success: false,
        message: "Overall rating is required",
      });
    }

    // Create review - use the guideId from booking (which is User ID)
    const review = await Review.create({
      bookingId,
      touristId: req.user.id,
      guideId: booking.guideId._id, // This is the User ID of the guide
      rating: {
        overall: rating.overall,
        knowledge: rating.knowledge || rating.overall,
        communication: rating.communication || rating.overall,
        punctuality: rating.punctuality || rating.overall,
      },
      comment,
      photos,
    });

    console.log("✅ Review created for guide:", {
      guideId: booking.guideId._id,
      guideName: booking.guideId.name,
      reviewId: review._id,
    });

    // Update guide's rating IMMEDIATELY
    await updateGuideRating(booking.guideId._id);

    await review.populate("touristId", "name avatar");
    await review.populate("guideId", "name");

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    next(error);
  }
};

// @desc    Get featured reviews for homepage
// @route   GET /api/reviews/featured
// @access  Public
exports.getFeaturedReviews = async (req, res, next) => {
  try {
    const featuredReviews = await Review.find({
      isApproved: true,
    })
      .select("rating comment createdAt touristId guideId") // Only select needed fields
      .populate("touristId", "name avatar location")
      .populate("guideId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // Convert to plain JS objects for faster processing

    res.status(200).json({
      success: true,
      count: featuredReviews.length,
      data: featuredReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if review exists for booking
// @route   GET /api/reviews/booking/:bookingId
// @access  Private
exports.getReviewByBooking = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      bookingId: req.params.bookingId,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for guide
// @route   GET /api/reviews/guide/:guideId
// @access  Public
exports.getGuideReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, totalReviews, ratingStats] = await Promise.all([
      // Get paginated reviews
      Review.find({
        guideId: req.params.guideId,
        isApproved: true,
      })
        .select("rating comment createdAt touristId")
        .populate("touristId", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      // Get total count
      Review.countDocuments({
        guideId: req.params.guideId,
        isApproved: true,
      }),

      // Get rating stats
      Review.aggregate([
        {
          $match: {
            guideId: mongoose.Types.ObjectId(req.params.guideId),
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
      ]),
    ]);

    const stats = ratingStats.length > 0 ? ratingStats[0] : null;

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
      data: reviews,
      ratingStats: stats
        ? {
            averageOverall: Math.round(stats.averageOverall * 10) / 10,
            averageKnowledge: Math.round(stats.averageKnowledge * 10) / 10,
            averageCommunication:
              Math.round(stats.averageCommunication * 10) / 10,
            averagePunctuality: Math.round(stats.averagePunctuality * 10) / 10,
            totalReviews: stats.totalReviews,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews by tourist
// @route   GET /api/reviews/me
// @access  Private
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ touristId: req.user.id })
      .populate("guideId", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.touristId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    if (req.body.rating) {
      req.body.rating = {
        overall: req.body.rating.overall || review.rating.overall,
        knowledge: req.body.rating.knowledge || review.rating.knowledge,
        communication:
          req.body.rating.communication || review.rating.communication,
        punctuality: req.body.rating.punctuality || review.rating.punctuality,
      };
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("touristId", "name avatar");

    await updateGuideRating(review.guideId);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.touristId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const guideId = review.guideId;

    await Review.findByIdAndDelete(req.params.id);

    await updateGuideRating(guideId);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// FIXED: Enhanced helper function to update guide rating
const updateGuideRating = async (guideUserId) => {
  try {
    console.log(`🔄 Updating rating for guide (User ID): ${guideUserId}`);

    // Find all approved reviews for this guide using the User ID
    const reviews = await Review.find({
      guideId: guideUserId,
      isApproved: true,
    });

    console.log(
      `📊 Found ${reviews.length} approved reviews for guide ${guideUserId}`
    );

    if (reviews.length === 0) {
      console.log(
        `❌ No approved reviews found, resetting rating for guide: ${guideUserId}`
      );
      const resetResult = await GuideProfile.findOneAndUpdate(
        { userId: guideUserId },
        {
          "rating.average": 0,
          "rating.count": 0,
          "rating.breakdown.knowledge": 0,
          "rating.breakdown.communication": 0,
          "rating.breakdown.punctuality": 0,
        },
        { new: true }
      );

      if (resetResult) {
        console.log(`✅ Reset rating for guide: ${guideUserId}`);
      } else {
        console.log(`❌ Guide profile not found for userId: ${guideUserId}`);
        // Let's see what guides exist
        const allGuides = await GuideProfile.find({}).populate(
          "userId",
          "name"
        );
        console.log(
          "📋 All available guides:",
          allGuides.map((g) => ({
            userId: g.userId?._id,
            name: g.userId?.name,
          }))
        );
      }
      return;
    }

    // Calculate averages
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

    console.log(`📈 Updating guide ${guideUserId} with:`, updateData);

    const result = await GuideProfile.findOneAndUpdate(
      { userId: guideUserId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!result) {
      console.error(`❌ Guide profile not found for userId: ${guideUserId}`);
      return;
    }

    console.log(`✅ Successfully updated rating for guide: ${guideUserId}`);
    console.log(
      `⭐ New average: ${updateData["rating.average"]}, Reviews: ${updateData["rating.count"]}`
    );
  } catch (error) {
    console.error(`💥 Error updating guide rating for ${guideUserId}:`, error);
  }
};

// @desc    Manually update all guide ratings (for debugging)
// @route   POST /api/reviews/update-all-ratings
// @access  Private/Admin
exports.updateAllGuideRatings = async (req, res, next) => {
  try {
    console.log("🔄 Manually updating all guide ratings...");

    // Get all guides
    const guides = await GuideProfile.find({}).populate("userId", "name");
    console.log(`📊 Found ${guides.length} guides to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const guide of guides) {
      try {
        console.log(
          `🔄 Processing guide: ${guide.userId?.name} (User ID: ${guide.userId?._id})`
        );

        // Get reviews for this guide using the User ID
        const reviews = await Review.find({
          guideId: guide.userId._id,
          isApproved: true,
        });

        console.log(
          `📝 Found ${reviews.length} reviews for ${guide.userId?.name}`
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
      message: `Updated ${updatedCount} guides, ${errorCount} errors`,
      updatedCount,
      errorCount,
    });
  } catch (error) {
    console.error("💥 Error updating all guide ratings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating guide ratings",
    });
  }
};

// @desc    Debug guide ratings
// @route   GET /api/reviews/debug/guide/:guideUserId
// @access  Public
exports.debugGuideRatings = async (req, res, next) => {
  try {
    const guideUserId = req.params.guideUserId;

    console.log(`🔍 Debugging ratings for guide (User ID): ${guideUserId}`);

    // Get guide profile
    const guideProfile = await GuideProfile.findOne({
      userId: guideUserId,
    }).populate("userId", "name");
    console.log(
      `📊 Guide profile found:`,
      guideProfile
        ? {
            name: guideProfile.userId?.name,
            rating: guideProfile.rating,
          }
        : "NOT FOUND"
    );

    // Get reviews for this guide
    const reviews = await Review.find({
      guideId: guideUserId,
      isApproved: true,
    })
      .populate("touristId", "name")
      .populate("guideId", "name");

    console.log(`📝 Reviews found: ${reviews.length}`);

    reviews.forEach((review, index) => {
      console.log(`   Review ${index + 1}:`, {
        tourist: review.touristId?.name,
        guide: review.guideId?.name,
        rating: review.rating,
        isApproved: review.isApproved,
      });
    });

    res.status(200).json({
      success: true,
      guideProfile: guideProfile
        ? {
            name: guideProfile.userId?.name,
            rating: guideProfile.rating,
          }
        : null,
      reviewsCount: reviews.length,
      reviews: reviews.map((r) => ({
        tourist: r.touristId?.name,
        guide: r.guideId?.name,
        rating: r.rating,
        isApproved: r.isApproved,
      })),
    });
  } catch (error) {
    console.error("💥 Debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug error",
    });
  }
};

// @desc    SUPER DEBUG - Comprehensive debugging
// @route   GET /api/reviews/super-debug
// @access  Public
exports.superDebug = async (req, res, next) => {
  try {
    console.log("🔍 === SUPER DEBUG START ===");

    // 1. Get all guides
    const guides = await GuideProfile.find({}).populate("userId", "name");
    console.log(`📊 Total guides: ${guides.length}`);

    // 2. Get all reviews
    const allReviews = await Review.find({}).populate("guideId", "name");
    console.log(`📝 Total reviews in system: ${allReviews.length}`);

    // 3. Log all reviews with guide info
    console.log("📋 ALL REVIEWS:");
    allReviews.forEach((review, index) => {
      console.log(`   Review ${index + 1}:`, {
        reviewId: review._id,
        guideId: review.guideId?._id,
        guideName: review.guideId?.name,
        rating: review.rating,
        bookingId: review.bookingId,
      });
    });

    // 4. Log all guides with their user IDs
    console.log("👥 ALL GUIDES:");
    guides.forEach((guide, index) => {
      console.log(`   Guide ${index + 1}:`, {
        guideProfileId: guide._id,
        userId: guide.userId?._id,
        userName: guide.userId?.name,
        currentRating: guide.rating,
      });
    });

    // 5. Check if reviews match guides
    console.log("🔗 REVIEW-GUIDE MATCHING:");
    guides.forEach((guide) => {
      const guideReviews = allReviews.filter(
        (review) =>
          review.guideId &&
          review.guideId._id.toString() === guide.userId._id.toString()
      );
      console.log(`   ${guide.userId?.name}: ${guideReviews.length} reviews`);
    });

    res.status(200).json({
      success: true,
      data: {
        totalGuides: guides.length,
        totalReviews: allReviews.length,
        guides: guides.map((g) => ({
          name: g.userId?.name,
          userId: g.userId?._id,
          rating: g.rating,
        })),
        reviews: allReviews.map((r) => ({
          guideId: r.guideId?._id,
          guideName: r.guideId?.name,
          rating: r.rating,
        })),
      },
    });
  } catch (error) {
    console.error("💥 Super debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug error",
    });
  }
};
