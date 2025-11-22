const Booking = require("../models/Booking");
const GuideProfile = require("../models/GuideProfile");
const User = require("../models/User");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      guideId,
      date,
      duration,
      startTime,
      meetingPoint,
      numberOfPeople,
      specialRequests,
    } = req.body;

    // Check if guide exists and is verified
    const guide = await GuideProfile.findOne({
      userId: guideId,
      // verificationStatus: "approved",
      isAvailable: true,
    }).populate("userId", "name email");

    // If not found by userId, try by _id
    if (!guide) {
      guide = await GuideProfile.findOne({
        _id: guideId,
        isAvailable: true,
      }).populate("userId", "name email");
    }

    console.log("🔍 Guide found:", guide);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message:
          "Guide not found or not available. Please check if the guide exists and is marked as available.",
      });
    }

    // Calculate price
    const price = guide.hourlyRate * duration;

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      guideId,
      date,
      startTime,
      status: { $in: ["confirmed", "pending"] },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "Guide is not available at this time",
      });
    }

    // Create booking
    const booking = await Booking.create({
      touristId: req.user.id,
      guideId,
      date,
      duration,
      startTime,
      meetingPoint,
      numberOfPeople: numberOfPeople || 1,
      specialRequests,
      price,
    });

    await booking.populate("touristId", "name email phone");
    await booking.populate("guideId", "name email phone");

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let bookings;

    if (req.user.role === "tourist") {
      bookings = await Booking.find({ touristId: req.user.id })
        .populate("guideId", "name avatar")
        .sort({ date: -1 });
    } else if (req.user.role === "guide") {
      bookings = await Booking.find({ guideId: req.user.id })
        .populate("touristId", "name avatar")
        .sort({ date: -1 });
    } else {
      // Admin can see all bookings
      bookings = await Booking.find()
        .populate("touristId", "name")
        .populate("guideId", "name")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("touristId", "name email phone avatar")
      .populate("guideId", "name email phone avatar");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user is involved in this booking or is admin
    if (
      req.user.role !== "admin" &&
      booking.touristId._id.toString() !== req.user.id &&
      booking.guideId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    console.log("=== UPDATE BOOKING STATUS START ===");
    console.log("🔧 Booking ID:", bookingId);
    console.log("🔧 Requested Status:", status);
    console.log("🔧 User ID:", req.user.id);
    console.log("🔧 User Role:", req.user.role);
    console.log("🔧 Full Request Body:", req.body);

    // Validate booking ID format
    if (!bookingId || bookingId.length !== 24) {
      console.log("❌ Invalid booking ID format");
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }

    // Find the booking first
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.log("❌ Booking not found in database");
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    console.log("🔧 Found booking:", {
      id: booking._id,
      guideId: booking.guideId,
      touristId: booking.touristId,
      currentStatus: booking.status,
    });

    // Check if user is authorized to update this booking
    if (req.user.role === "guide") {
      // For guides, check if they own this booking
      console.log("🔧 Checking guide authorization...");
      console.log("🔧 User ID:", req.user.id);
      console.log("🔧 Booking Guide ID:", booking.guideId.toString());

      if (booking.guideId.toString() !== req.user.id) {
        console.log("❌ Guide not authorized - ID mismatch");
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this booking",
        });
      }
      console.log("✅ Guide authorized");
    } else if (req.user.role === "tourist") {
      // For tourists, check if they own this booking
      if (booking.touristId.toString() !== req.user.id) {
        console.log("❌ Tourist not authorized");
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this booking",
        });
      }
    }
    // Admin can update any booking

    // Validate status transition
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: pending, confirmed, completed, cancelled",
      });
    }

    console.log("✅ All validations passed - updating booking...");

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("guideId", "name email")
      .populate("touristId", "name email");

    console.log("✅ Status updated successfully:", updatedBooking.status);
    console.log("=== UPDATE BOOKING STATUS END ===");

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while updating booking status",
      error: error.message, // Include error message for debugging
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res, next) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        total: totalBookings,
        completed: completedBookings,
        revenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
