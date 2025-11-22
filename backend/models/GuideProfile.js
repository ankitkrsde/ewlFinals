const mongoose = require("mongoose");

const guideProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: [1000, "Bio cannot be more than 1000 characters"],
    default: "",
  },
  specialties: [
    {
      type: String,
      enum: [
        "Historical",
        "Cultural",
        "Food",
        "Adventure",
        "Spiritual",
        "Nature",
        "Photography",
        "Shopping",
        "Architecture",
        "Wildlife",
      ],
    },
  ],
  experience: {
    type: Number,
    min: 0,
    default: 0,
  },
  hourlyRate: {
    type: Number,
    default: 0,
    min: [0, "Hourly rate cannot be negative"],
  },
  services: [
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      duration: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      slots: [
        {
          start: {
            type: String,
            default: "09:00",
          },
          end: {
            type: String,
            default: "17:00",
          },
        },
      ],
    },
  ],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
    breakdown: {
      knowledge: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
    },
  },
  portfolio: [
    {
      image: String,
      caption: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cities: [
    {
      type: String,
    },
  ],
  languages: [
    {
      type: String,
      enum: [
        "Hindi",
        "English",
        "Tamil",
        "Telugu",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Punjabi",
        "Malayalam",
        "Kannada",
        "Other",
      ],
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
guideProfileSchema.index({ userId: 1 });
guideProfileSchema.index({ cities: 1 });
guideProfileSchema.index({ "rating.average": -1 });
guideProfileSchema.index({ isAvailable: 1 });

// Update updatedAt before saving
guideProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate and update rating
guideProfileSchema.statics.updateRating = async function (guideId) {
  const Review = mongoose.model("Review");

  const ratingStats = await Review.aggregate([
    {
      $match: { guideId: mongoose.Types.ObjectId(guideId) },
    },
    {
      $group: {
        _id: "$guideId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        knowledgeAvg: { $avg: "$ratingBreakdown.knowledge" },
        communicationAvg: { $avg: "$ratingBreakdown.communication" },
        punctualityAvg: { $avg: "$ratingBreakdown.punctuality" },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    const stats = ratingStats[0];
    await this.findByIdAndUpdate(guideId, {
      "rating.average": Math.round(stats.averageRating * 10) / 10,
      "rating.count": stats.totalReviews,
      "rating.breakdown.knowledge": Math.round(stats.knowledgeAvg * 10) / 10,
      "rating.breakdown.communication":
        Math.round(stats.communicationAvg * 10) / 10,
      "rating.breakdown.punctuality":
        Math.round(stats.punctualityAvg * 10) / 10,
    });
  }
};

// Instance method to check if guide is available on a specific day
guideProfileSchema.methods.isAvailableOnDay = function (day) {
  const dayAvailability = this.availability.find((avail) => avail.day === day);
  return dayAvailability && dayAvailability.slots.length > 0;
};

// Virtual for profile completion percentage
guideProfileSchema.virtual("completionPercentage").get(function () {
  const requiredFields = [
    "bio",
    "specialties",
    "experience",
    "hourlyRate",
    "cities",
    "languages",
    "services",
  ];

  let completedFields = 0;

  requiredFields.forEach((field) => {
    if (field === "bio" && this[field] && this[field].trim().length > 0) {
      completedFields++;
    } else if (Array.isArray(this[field]) && this[field].length > 0) {
      completedFields++;
    } else if (typeof this[field] === "number" && this[field] > 0) {
      completedFields++;
    }
  });

  return Math.round((completedFields / requiredFields.length) * 100);
});

// Ensure virtual fields are serialized
guideProfileSchema.set("toJSON", { virtuals: true });
guideProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("GuideProfile", guideProfileSchema);
