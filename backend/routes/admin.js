const express = require("express");
const {
  getDashboardStats,
  getVerificationRequests,
  updateVerificationStatus,
  getUsersAdmin,
  updateUserStatus,
  moderateReview,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/verifications", getVerificationRequests);
router.put("/verifications/:id", updateVerificationStatus);
router.get("/users", getUsersAdmin);
router.put("/users/:id/status", updateUserStatus);
router.put("/reviews/:id", moderateReview);

module.exports = router;
