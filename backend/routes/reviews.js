const express = require("express");
const {
  createReview,
  getGuideReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/guide/:guideId", getGuideReviews);

router.use(protect);

router.get("/me", getMyReviews);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
