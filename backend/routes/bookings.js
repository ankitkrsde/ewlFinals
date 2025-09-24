const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  getBookingStats,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/stats", authorize("admin"), getBookingStats);
router.get("/:id", getBooking);
router.put("/:id/status", updateBookingStatus);

module.exports = router;
