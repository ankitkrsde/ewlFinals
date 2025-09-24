const express = require("express");
const {
  getGuides,
  getGuide,
  createUpdateGuideProfile,
  getGuidesByCity,
  getMyGuideProfile,
  updateAvailability,
} = require("../controllers/guideController");
const { protect, authorize } = require("../middleware/auth");
const { uploadMultiple } = require("../middleware/upload");

const router = express.Router();

router.get("/", getGuides);
router.get("/city/:city", getGuidesByCity);
router.get("/:id", getGuide);

router.use(protect);

router.get("/me/guide", authorize("guide"), getMyGuideProfile);
router.post("/", authorize("guide"), uploadMultiple, createUpdateGuideProfile);
router.put("/", authorize("guide"), uploadMultiple, createUpdateGuideProfile);
router.put("/availability", authorize("guide"), updateAvailability);

module.exports = router;
