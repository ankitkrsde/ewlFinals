const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true,
  },
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
    maxlength: [1000, "Comment cannot be more than 1000 characters"],
  },
  photos: [String],
  isApproved: {
    type: Boolean,
    default: false,
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

// Indexes
reviewSchema.index({ guideId: 1, createdAt: -1 });
reviewSchema.index({ touristId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Update updatedAt field before saving
reviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
