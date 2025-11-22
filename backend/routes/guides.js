const express = require("express");
const {
  getGuides,
  getGuide,
  createUpdateGuideProfile,
  getGuidesByCity,
  getMyGuideProfile,
  updateAvailability,
  checkGuideAvailability,
  getGuideStats,
  updateGuideProfile,
  getGuideEarnings,
} = require("../controllers/guideController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get("/", getGuides);
router.get("/city/:city", getGuidesByCity);

// ========== PROTECTED ROUTES ==========
// SPECIFIC ROUTES MUST COME BEFORE PARAMETERIZED ROUTES
router.get("/me", protect, authorize("guide"), getMyGuideProfile);
router.get("/stats", protect, authorize("guide"), getGuideStats);
router.get("/earnings", protect, authorize("guide"), getGuideEarnings);
router.post("/", protect, authorize("guide"), createUpdateGuideProfile);
router.put("/", protect, authorize("guide"), createUpdateGuideProfile);
router.put("/profile", protect, authorize("guide"), updateGuideProfile);
router.put("/availability", protect, authorize("guide"), updateAvailability);

// ========== PARAMETERIZED ROUTES (MUST COME LAST) ==========
router.get("/:id", getGuide);
router.get("/:id/availability", checkGuideAvailability);

module.exports = router;
