const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India",
  },
  description: String,
  popularAttractions: [String],
  bestTimeToVisit: String,
  languages: [String],
  currency: {
    type: String,
    default: "INR",
  },
  timezone: {
    type: String,
    default: "Asia/Kolkata",
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  guideCount: {
    type: Number,
    default: 0,
  },
  featuredGuides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuideProfile",
    },
  ],
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
citySchema.index({ name: 1 });
citySchema.index({ state: 1 });
citySchema.index({ isActive: 1 });

// Update updatedAt field before saving
citySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("City", citySchema);
