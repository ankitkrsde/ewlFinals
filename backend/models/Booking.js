const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in hours
    required: true,
    min: [1, "Duration must be at least 1 hour"],
  },
  startTime: {
    type: String, // HH:MM format
    required: true,
  },
  meetingPoint: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    min: 1,
    default: 1,
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
    default: "pending",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    currency: {
      type: String,
      default: "INR",
    },
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ["tourist", "guide", "admin"],
    },
    reason: String,
    timestamp: Date,
    refundAmount: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
bookingSchema.index({ touristId: 1, status: 1 });
bookingSchema.index({ guideId: 1, status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });

// Update updatedAt field before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
