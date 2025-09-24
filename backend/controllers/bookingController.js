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
      verificationStatus: "approved",
      isAvailable: true,
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found or not available",
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
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (
      req.user.role === "tourist" &&
      booking.touristId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    if (
      req.user.role === "guide" &&
      booking.guideId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    // Update status based on user role and current status
    let updatedBooking;

    if (req.user.role === "guide" && booking.status === "pending") {
      // Guide can accept or reject pending bookings
      if (["confirmed", "rejected"].includes(status)) {
        updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true, runValidators: true }
        ).populate("touristId guideId", "name email");
      }
    } else if (req.user.role === "tourist" && booking.status === "confirmed") {
      // Tourist can cancel confirmed bookings
      if (status === "cancelled") {
        updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id,
          {
            status,
            cancellation: {
              cancelledBy: "tourist",
              reason: req.body.reason,
              timestamp: new Date(),
            },
          },
          { new: true, runValidators: true }
        ).populate("touristId guideId", "name email");
      }
    } else if (req.user.role === "admin") {
      // Admin can update any status
      updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      ).populate("touristId guideId", "name email");
    }

    if (!updatedBooking) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
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
