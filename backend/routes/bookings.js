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

// Add this new route for tourists to get their bookings
router.get(
  "/my-bookings",
  (req, res, next) => {
    // This will handle tourist's bookings in the controller
    req.query.userRole = req.user.role;
    req.query.userId = req.user.id;
    next();
  },
  getBookings
);

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/stats", authorize("admin"), getBookingStats);
router.get("/:id", getBooking);
router.put("/:id/status", updateBookingStatus);

module.exports = router;
