const express = require("express");
const cacheMiddleware = require("../middleware/cache");
const {
  createReview,
  getGuideReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getFeaturedReviews,
  getReviewByBooking,
  updateAllGuideRatings,
  superDebug,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth"); // Added authorize import

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get("/featured", cacheMiddleware(300), getFeaturedReviews); // Cache for 5 minutes
router.get("/guide/:guideId", cacheMiddleware(300), getGuideReviews); // Cache for 5 minutes

// ========== PROTECTED ROUTES ==========
router.get("/super-debug", superDebug);
router.get("/me", protect, getMyReviews);
router.get("/booking/:bookingId", protect, getReviewByBooking);
router.post("/", protect, createReview);
router.post(
  "/update-all-ratings",
  protect,
  authorize("admin"),
  updateAllGuideRatings
);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
