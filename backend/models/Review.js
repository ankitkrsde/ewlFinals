const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    knowledge: {
      type: Number,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  photos: [String],
  isApproved: {
    type: Boolean,
    default: true,
  },
  response: {
    comment: String,
    timestamp: Date,
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

// Index for better query performance
reviewSchema.index({ guideId: 1, createdAt: -1 });
reviewSchema.index({ touristId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
