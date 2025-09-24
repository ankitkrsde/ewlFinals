const Review = require("../models/Review");
const Booking = require("../models/Booking");
const GuideProfile = require("../models/GuideProfile");

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment, photos } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);

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

    // Create review
    const review = await Review.create({
      bookingId,
      touristId: req.user.id,
      guideId: booking.guideId,
      rating,
      comment,
      photos,
    });

    // Update guide's rating
    await updateGuideRating(booking.guideId);

    await review.populate("touristId", "name avatar");

    res.status(201).json({
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
    const reviews = await Review.find({ guideId: req.params.guideId })
      .populate("touristId", "name avatar")
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

    // Make sure user is the author of the review
    if (review.touristId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("touristId", "name avatar");

    // Update guide's rating
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

    // Make sure user is the author of the review or admin
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

    // Update guide's rating
    await updateGuideRating(guideId);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update guide rating
const updateGuideRating = async (guideId) => {
  const reviews = await Review.find({ guideId, isApproved: true });

  if (reviews.length === 0) {
    await GuideProfile.findOneAndUpdate(
      { userId: guideId },
      {
        "rating.average": 0,
        "rating.count": 0,
        "rating.breakdown.knowledge": 0,
        "rating.breakdown.communication": 0,
        "rating.breakdown.punctuality": 0,
      }
    );
    return;
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + review.rating.overall,
    0
  );
  const avgRating = totalRating / reviews.length;

  const knowledgeTotal = reviews.reduce(
    (sum, review) => sum + (review.rating.knowledge || 0),
    0
  );
  const communicationTotal = reviews.reduce(
    (sum, review) => sum + (review.rating.communication || 0),
    0
  );
  const punctualityTotal = reviews.reduce(
    (sum, review) => sum + (review.rating.punctuality || 0),
    0
  );

  await GuideProfile.findOneAndUpdate(
    { userId: guideId },
    {
      "rating.average": parseFloat(avgRating.toFixed(1)),
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
    }
  );
};
